import React, { useState, useRef, useEffect } from 'react';
import { NavigationArrowIcon, BicycleIcon, BellIcon, BellSlashIcon, LighthouseIcon } from '@phosphor-icons/react';
import type { Departure } from '../types/departure';

// ── CircularProgress ─────────────────────────────────────────────────────────

interface CircularProgressProps {
	progress: number;
	size?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ progress, size = 20 }) => {
	const r = 9;
	const circumference = 2 * Math.PI * r;
	return (
		<div className="relative" style={{ width: size, height: size }}>
			<svg className="size-full -rotate-90" viewBox="0 0 24 24">
				<circle cx="12" cy="12" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-100" />
				<circle
					cx="12" cy="12" r={r}
					fill="none" stroke="currentColor" strokeWidth="3"
					strokeDasharray={circumference}
					strokeDashoffset={circumference * (1 - progress / 100)}
					strokeLinecap="round"
					className="text-sky-600"
				/>
			</svg>
		</div>
	);
};

// ── DepartureCard ─────────────────────────────────────────────────────────────

const PANEL_WIDTH = 64; // px = w-16
const VELOCITY_THRESHOLD = 0.25; // px/ms — fast swipe

interface DepartureCardProps {
	departure: Departure;
	isSpecificRoute: boolean;
	isFirst?: boolean;
	isOpen: boolean;
	onToggle: (isOpen: boolean) => void;
}

const DepartureCard: React.FC<DepartureCardProps> = ({ departure, isSpecificRoute, isFirst, isOpen, onToggle }) => {
	const isCancelled = departure.isCancelled;
	const isDelayed = departure.status === 'Delayed';
	const isBoarding = departure.status === 'Boarding';

	// ── Shadow state ───────────────────────────────────
	const [hasShadow, setHasShadow] = useState(false);
	// Outer ref wraps the whole card (sticky + shadow live here, no overflow-hidden)
	const outerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Find the scroll container (grandparent: gap-px div → overflow-y-auto div)
		const getScrollContainer = () =>
			outerRef.current?.parentElement?.parentElement ?? null;

		const handleScroll = () => {
			const scrollContainer = getScrollContainer();
			if (!scrollContainer || !outerRef.current) return;

			const scrollTop = scrollContainer.scrollTop;

			if (isFirst) {
				setHasShadow(scrollTop > 10);
			}
		};

		const scrollContainer = getScrollContainer();
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
			handleScroll(); // init
			return () => scrollContainer.removeEventListener('scroll', handleScroll);
		}
	}, [isFirst]);

	// ── Subscription state ────────────────────────────────────────────────────
	const [subscribed, setSubscribed] = useState(departure.showBell ?? false);
	const [panelIsUnsubscribe, setPanelIsUnsubscribe] = useState(departure.showBell ?? false);
	const colorUpdateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// ── Drag / swipe state ────────────────────────────────────────────────────
	const [dragX, setDragX] = useState(0);
	const [animating, setAnimating] = useState(false);
	const openness = Math.abs(dragX) / PANEL_WIDTH;

	// Close card if isOpen becomes false from parent
	useEffect(() => {
		if (!isOpen && dragX !== 0) {
			setAnimating(true);
			setDragX(0);
		}
	}, [isOpen]);

	// ── Touch tracking ────────────────────────────────────────────────────────
	const touchStartX = useRef<number | null>(null);
	const touchStartY = useRef<number | null>(null);
	const touchStartTime = useRef(0);
	const dragXAtStart = useRef(0);
	const isScrolling = useRef<boolean | null>(null);

	const handleTouchStart = (e: React.TouchEvent) => {
		if (colorUpdateTimer.current) clearTimeout(colorUpdateTimer.current);
		touchStartX.current = e.touches[0].clientX;
		touchStartY.current = e.touches[0].clientY;
		touchStartTime.current = Date.now();
		dragXAtStart.current = dragX;
		isScrolling.current = null;
		setAnimating(false);
		
		// If another card is open, we don't close it yet to allow smooth interaction,
		// but we might want to signal that this card is potentially becoming active.
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (touchStartX.current === null || touchStartY.current === null) return;
		const dx = e.touches[0].clientX - touchStartX.current;
		const dy = e.touches[0].clientY - touchStartY.current;
		if (isScrolling.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
			isScrolling.current = Math.abs(dy) > Math.abs(dx);
		}
		if (isScrolling.current) return;
		e.stopPropagation();
		setDragX(Math.max(-PANEL_WIDTH, Math.min(0, dragXAtStart.current + dx)));
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX.current === null || isScrolling.current) {
			touchStartX.current = null;
			touchStartY.current = null;
			isScrolling.current = null;
			return;
		}
		const dx = e.changedTouches[0].clientX - touchStartX.current;
		const dt = Math.max(1, Date.now() - touchStartTime.current);
		const velocity = dx / dt;
		setAnimating(true);
		const currentX = dragXAtStart.current + dx;
		const snapOpen =
			velocity < -VELOCITY_THRESHOLD ||
			(velocity > VELOCITY_THRESHOLD ? false : currentX < -PANEL_WIDTH / 2);
		
		if (snapOpen) {
			setDragX(-PANEL_WIDTH);
			onToggle(true);
		} else {
			setDragX(0);
			onToggle(false);
		}
		
		touchStartX.current = null;
		touchStartY.current = null;
		isScrolling.current = null;
	};

	// ── Mouse drag (desktop) ──────────────────────────────────────────────────
	const mouseStartX = useRef<number | null>(null);
	const mouseDragXAtStart = useRef(0);

	const handleMouseDown = (e: React.MouseEvent) => {
		mouseStartX.current = e.clientX;
		mouseDragXAtStart.current = dragX;
		setAnimating(false);
	};
	const handleMouseMove = (e: React.MouseEvent) => {
		if (mouseStartX.current === null || !(e.buttons & 1)) return;
		setDragX(Math.max(-PANEL_WIDTH, Math.min(0, mouseDragXAtStart.current + (e.clientX - mouseStartX.current))));
	};
	const handleMouseUp = (e: React.MouseEvent) => {
		if (mouseStartX.current === null) return;
		setAnimating(true);
		const snapOpen = (e.clientX - mouseStartX.current) < -PANEL_WIDTH / 4;
		if (snapOpen) {
			setDragX(-PANEL_WIDTH);
			onToggle(true);
		} else {
			setDragX(0);
			onToggle(false);
		}
		mouseStartX.current = null;
	};

	// ── Bell click ────────────────────────────────────────────────────────────
	const CLOSE_DURATION_MS = 280;

	const handleBellClick = () => {
		const nextSubscribed = !subscribed;
		setSubscribed(nextSubscribed);
		setAnimating(true);
		setDragX(0);
		onToggle(false);
		colorUpdateTimer.current = setTimeout(() => {
			setPanelIsUnsubscribe(nextSubscribed);
		}, CLOSE_DURATION_MS);
	};

	// ── Derived visual values ─────────────────────────────────────────────────
	const panelBg = panelIsUnsubscribe ? 'bg-red-600' : 'bg-sky-600';
	const bellScale = 0.7 + 0.3 * openness;

	return (
		<div
			ref={outerRef}
			className={`${isFirst ? 'sticky top-0 z-20 bg-linear-to-b from-app-background from-50% via-app-background/90 to-transparent' : 'z-0 relative'}`}
		>
			{/* Dedicated shadow div that isn't clipped by overflow-hidden */}
			{isFirst && (
				<div
					className={`absolute top-0 bottom-0 right-3 left-[64px] rounded-xl transition-shadow duration-500 pointer-events-none ${hasShadow ? 'shadow-[0_8px_20px_rgba(0,0,0,0.12)]' : ''}`}
					style={{ zIndex: 1 }}
				/>
			)}

			<div
				className="relative overflow-hidden select-none bg-transparent"
				style={{ zIndex: 2 }} // Content above the shadow div
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
				{/* ── Action panel and Card content shared wrapper ─────────────────── */}
				<div className="flex relative">
					{/* Time column (remains fixed) */}
					<div className="w-16 shrink-0 flex items-start justify-center pt-4 bg-transparent">
						<span className="text-sm text-gray-500">{departure.time}</span>
					</div>

					{/* Shared container with rounded corners and overflow hidden */}
					<div 
						className="flex flex-1 mr-3 rounded-xl overflow-hidden relative"
						style={{ height: 'min-content' }}
					>
						{/* Action panel (revealed as the card shrinks) */}
						<div 
							className={`absolute right-0 top-0 bottom-0 w-16 ${panelBg} flex items-center justify-center`}
							style={{ zIndex: 1 }}
						>
							<button
								className="flex items-center justify-center size-full text-white"
								style={{
									transform: `scale(${bellScale})`,
									transition: animating ? `transform ${CLOSE_DURATION_MS}ms ease-out` : 'none',
									pointerEvents: openness > 0.5 ? 'auto' : 'none',
								}}
								onClick={handleBellClick}
							>
								{panelIsUnsubscribe
									? <BellSlashIcon size={24} weight="fill" />
									: <BellIcon size={24} weight="fill" />
								}
							</button>
						</div>

						{/* Card content (shrinks from the right) */}
						<div
							className={`flex flex-1 p-2 items-stretch ${isCancelled ? 'bg-app-background' : 'bg-white'} relative`}
							style={{
								zIndex: 2,
								marginRight: `${-dragX}px`,
								transition: animating ? `margin-right ${CLOSE_DURATION_MS}ms ease-out` : 'none',
							}}
						>
							{/* Route color stripe */}
							<div className={`w-1.5 shrink-0 rounded-full ${departure.color}`} />

							{/* Main content */}
							<div className="flex-1 py-2 px-2 flex flex-col justify-center relative">

								{/* Top row: timeUntil + destination + bell badge */}
								<div className="flex justify-between items-start">
									<div className="flex flex-col items-baseline gap-0">
										<span className={`text-xl leading-5 font-bold ${isCancelled ? 'text-gray-400' : 'text-gray-900'}`}>
											{departure.timeUntil}
										</span>
										{departure.delay && (
											<span className="text-sm font-normal text-red-600">{departure.delay}</span>
										)}
									</div>
									<div className="flex items-center">
										{!isSpecificRoute && departure.destination && (
											<div className={`flex items-center gap-0.5 text-sm font-normal ${isCancelled ? 'text-gray-400' : 'text-gray-900'}`}>
												{(() => {
													let originStr = departure.origin;
													if (!originStr) {
														const d = departure.destination;
														if (d === 'Cacilhas' || d === 'Montijo' || d === 'Seixal') originStr = 'Cais do Sodre';
														else if (d === 'Barreiro') originStr = 'Terreiro do Paço';
														else originStr = 'Porto-Brandão';
													}
													return (
														<>
															{originStr === 'Belém' && <NavigationArrowIcon weight="fill" size={14} className="text-sky-600 -scale-x-100" />}
															<span>{originStr}</span>
															<span className="mx-1">→</span>
															{departure.destination === 'Belém' && <NavigationArrowIcon weight="fill" size={14} className="text-sky-600 -scale-x-100" />}
															<span>{departure.destination}</span>
														</>
													);
												})()}
											</div>
										)}
										{/* Bell badge */}
										<div
											style={{
												width: subscribed ? '18px' : '0px',
												marginLeft: subscribed ? '6px' : '0px',
												overflow: 'hidden',
												opacity: subscribed ? 1 : 0,
												flexShrink: 0,
												transition: 'width 200ms ease-out, margin-left 200ms ease-out, opacity 200ms ease-out',
											}}
										>
											<BellIcon size={16} weight="fill" className="text-sky-600 block" />
										</div>
									</div>
								</div>

								{/* Bottom row: status + hall/bikes */}
								<div className="flex justify-between items-start mt-3">
									<div className={`flex ${isBoarding ? 'flex-col gap-1' : 'items-center gap-2'}`}>
										<span className={`text-sm font-normal ${isCancelled ? 'text-gray-400' : 'text-gray-500'}`}>
											{departure.status}
										</span>
										{!isCancelled && !isBoarding && (
											<div className={`size-1.5 rounded-full ${isDelayed ? 'bg-red-600' : 'bg-green-500'}`} />
										)}
										{isCancelled && <div className="size-2 rounded-full bg-red-400" />}
										{isBoarding && (
											<div className="flex items-center gap-2">
												<CircularProgress progress={departure.progress ?? 0} />
												<span className="text-sm font-normal text-gray-900 tracking-tight">
													{departure.progress}%
												</span>
											</div>
										)}
									</div>

									<div className="flex flex-col items-end gap-1">
										<span className={`text-sm font-normal ${isCancelled ? 'text-gray-400' : 'text-gray-500'}`}>
											{departure.hall}
										</span>
										{departure.bikes !== undefined && (
											<div className="flex items-center gap-1.5">
												<span className="text-sm font-normal text-gray-900">{departure.bikes}</span>
												<BicycleIcon size={20} className="text-sky-600" weight="regular" />
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DepartureCard;
