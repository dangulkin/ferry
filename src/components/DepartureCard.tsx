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
				<circle cx="12" cy="12" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-gray-100" />
				<circle
					cx="12" cy="12" r={r}
					fill="none" stroke="currentColor" strokeWidth="5"
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
}

const DepartureCard: React.FC<DepartureCardProps> = ({ departure, isSpecificRoute, isFirst }) => {
	const isCancelled = departure.isCancelled;
	const isDelayed = departure.status === 'Delayed';
	const isBoarding = departure.status === 'Boarding';

	// ── Scroll-driven time opacity & shadow ───────────────────────────────────
	const [timeOpacity, setTimeOpacity] = useState(1);
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
				// First card: always keep time visible, just add shadow
				setTimeOpacity(1);
				setHasShadow(scrollTop > 10);
			} else {
				// Non-first cards: fade time only when entering under the sticky card
				const stickyCard = outerRef.current.parentElement?.firstElementChild as HTMLElement | null;
				if (!stickyCard) return;

				const stickyBottom = stickyCard.getBoundingClientRect().bottom;
				const myTop = outerRef.current.getBoundingClientRect().top;
				// overlap: how many px of this card are hidden under the sticky card
				const overlap = stickyBottom - myTop;
				// Fade the time label over 48px of overlap (time label is at the top of the card)
				setTimeOpacity(Math.max(0, Math.min(1, 1 - overlap / 48)));
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
		setDragX(snapOpen ? -PANEL_WIDTH : 0);
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
		setDragX((e.clientX - mouseStartX.current) < -PANEL_WIDTH / 4 ? -PANEL_WIDTH : 0);
		mouseStartX.current = null;
	};

	// ── Bell click ────────────────────────────────────────────────────────────
	const CLOSE_DURATION_MS = 280;

	const handleBellClick = () => {
		const nextSubscribed = !subscribed;
		setSubscribed(nextSubscribed);
		setAnimating(true);
		setDragX(0);
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
			className={`${isFirst ? 'sticky top-0 z-20' : 'z-0'}`}
		>
			{/* Shadow div for the white body (right part) of the sticky card */}
			{isFirst && (
				<div
					className={`absolute inset-y-0 right-0 left-[64px] transition-shadow duration-500 pointer-events-none ${hasShadow ? 'shadow-[0_4px_16px_rgba(0,0,0,0.1)]' : ''}`}
					style={{ zIndex: 1 }} // Needs to be above other cards but behind this card's content? Actually z-index 1 is fine since this is inside z-20. Wait, z-index inside sticky is relative.
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
				{/* ── Action panel ──────────────────────────────────────────── */}
				<div className={`absolute right-0 top-0 bottom-0 w-16 ${panelBg} flex items-center justify-center`}>
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

				{/* ── Card content ───────────────────────────────────────────── */}
				<div
					className="flex relative"
					style={{
						transform: `translateX(${dragX}px)`,
						transition: animating ? `transform ${CLOSE_DURATION_MS}ms ease-out` : 'none',
						backgroundColor: 'inherit',
					}}
				>
					{/* Time column */}
					<div
						className="w-16 shrink-0 flex items-start justify-center pt-5 bg-transparent"
						style={{ opacity: timeOpacity }}
					>
						<span className="text-sm text-gray-500">{departure.time}</span>
					</div>

					{/* Card container */}
					<div className={`flex flex-1 p-1 items-stretch ${isCancelled ? 'bg-gray-50/50' : 'bg-white'} rounded-xl mr-4`}>
						{/* Route color stripe */}
						<div className={`w-1.5 shrink-0 rounded-full ${departure.color}`} />

						{/* Main content */}
						<div className="flex-1 py-3 px-4 flex flex-col justify-center relative">

							{/* Top row: timeUntil + destination + bell badge */}
							<div className="flex justify-between items-center">
								<div className="flex items-baseline gap-2">
									<span className={`text-xl font-bold ${isCancelled ? 'text-gray-400' : 'text-gray-900'}`}>
										{departure.timeUntil}
									</span>
									{departure.delay && (
										<span className="text-sm font-normal text-red-600">{departure.delay}</span>
									)}
								</div>
								<div className="flex items-center">
									{!isSpecificRoute && departure.destination && (
										<div className={`flex items-center gap-1.5 text-sm font-bold ${isCancelled ? 'text-gray-400' : 'text-gray-900'}`}>
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
														{originStr === 'Belém' && <NavigationArrowIcon weight="fill" size={14} className="text-sky-600" />}
														<span>{originStr}</span>
														<span className="mx-0.5">➔</span>
														{departure.destination === 'Belém' && <NavigationArrowIcon weight="fill" size={14} className="text-sky-600" />}
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
							<div className="flex justify-between items-start mt-2">
								<div className={`flex ${isBoarding ? 'flex-col gap-2' : 'items-center gap-2'}`}>
									<span className={`text-sm font-normal ${isCancelled ? 'text-gray-400' : 'text-gray-900'}`}>
										{departure.status}
									</span>
									{!isCancelled && !isBoarding && (
										<div className={`size-2 rounded-full ${isDelayed ? 'bg-red-600' : 'bg-green-500'}`} />
									)}
									{isCancelled && <div className="size-2 rounded-full bg-red-400" />}
									{isBoarding && (
										<div className="flex items-center gap-2">
											<CircularProgress progress={departure.progress ?? 0} />
											<span className="text-sm font-bold text-gray-900 tracking-tight">
												{departure.progress}%
											</span>
										</div>
									)}
								</div>

								<div className="flex flex-col items-end gap-1">
									<span className={`text-sm font-normal ${isCancelled ? 'text-gray-400' : 'text-gray-900'}`}>
										{departure.hall}
									</span>
									{departure.bikes !== undefined && (
										<div className="flex items-center gap-1.5">
											<span className="text-sm font-bold text-gray-900">{departure.bikes}</span>
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
	);
};

export default DepartureCard;
