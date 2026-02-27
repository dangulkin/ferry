import React, { useState } from 'react';
import { LighthouseIcon, WarningIcon, GearIcon } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

import { BoatIcon } from './components/icons/BoatIcon';
import Departures from './components/Departures';
import Routes from './components/Routes';
import Alerts from './components/Alerts';
import Settings from './components/Settings';

const TABS = ['departures', 'routes', 'alerts', 'settings'];

export default function App() {
	const [activeTab, setActiveTab] = useState('departures');
	const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
	const [direction, setDirection] = useState(0);

	const changeTab = (newTab: string) => {
		const currentIndex = TABS.indexOf(activeTab);
		const newIndex = TABS.indexOf(newTab);
		if (currentIndex !== newIndex) {
			setDirection(newIndex > currentIndex ? 1 : -1);
			setActiveTab(newTab);
		}
	};

	const [touchStartX, setTouchStartX] = useState<number | null>(null);
	const [touchStartY, setTouchStartY] = useState<number | null>(null);

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStartX(e.touches[0].clientX);
		setTouchStartY(e.touches[0].clientY);
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX === null || touchStartY === null) {
			return;
		}

		const touchEndX = e.changedTouches[0].clientX;
		const touchEndY = e.changedTouches[0].clientY;
		const dx = touchEndX - touchStartX;
		const dy = touchEndY - touchStartY;

		// Edge swipe area: 40px from the screen edge
		const EDGE_THRESHOLD = 40;
		const isLeftEdge = touchStartX < EDGE_THRESHOLD;
		const isRightEdge = touchStartX > window.innerWidth - EDGE_THRESHOLD;

		if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
			const currentIndex = TABS.indexOf(activeTab);
			// Swipe left from the right edge
			if (dx < 0 && isRightEdge && currentIndex < TABS.length - 1) {
				changeTab(TABS[currentIndex + 1]);
			}
			// Swipe right from the left edge
			else if (dx > 0 && isLeftEdge && currentIndex > 0) {
				changeTab(TABS[currentIndex - 1]);
			}
		}
		setTouchStartX(null);
		setTouchStartY(null);
	};

	const renderContent = () => {
		switch (activeTab) {
			case 'departures':
				return <Departures selectedRoute={selectedRoute} onSelectRoute={() => changeTab('routes')} />;
			case 'routes':
				return <Routes onSelectRoute={(route) => { setSelectedRoute(route); changeTab('departures'); }} />;
			case 'alerts':
				return <Alerts />;
			case 'settings':
				return <Settings />;
			default:
				return <Departures selectedRoute={selectedRoute} onSelectRoute={() => changeTab('routes')} />;
		}
	};

	const variants = {
		enter: (direction: number) => ({
			x: direction > 0 ? '100%' : '-100%',
		}),
		center: {
			x: 0,
		},
		exit: (direction: number) => ({
			x: direction < 0 ? '100%' : '-100%',
		})
	};

	return (
		<div className="fixed inset-0 left-0 right-0 mx-auto flex flex-col bg-app-background font-sans text-gray-900 max-w-md overflow-hidden shadow-xl">
			<main
				className="flex-1 overflow-hidden relative"
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<AnimatePresence initial={false} custom={direction}>
					<motion.div
						key={activeTab}
						custom={direction}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: "tween", duration: 0.3, ease: "easeInOut" }
						}}
						className="absolute inset-0 flex flex-col w-full h-full bg-app-background pointer-events-auto"
					>
						{renderContent()}
					</motion.div>
				</AnimatePresence>
			</main>

			<nav className="shrink-0 bg-white border-t border-gray-200 px-2 pb-safe z-50">
				<div className="flex justify-around items-center h-16">
					<NavItem
						icon={<BoatIcon filled={activeTab === 'departures'} size={24} />}
						label="Departures"
						isActive={activeTab === 'departures'}
						onClick={() => changeTab('departures')}
					/>
					<NavItem
						icon={<LighthouseIcon weight={activeTab === 'routes' ? 'fill' : 'regular'} size={24} />}
						label="Routes"
						isActive={activeTab === 'routes'}
						onClick={() => changeTab('routes')}
					/>
					<NavItem
						icon={
							<div className="relative">
								<WarningIcon weight={activeTab === 'alerts' ? 'fill' : 'regular'} size={24} />
								<span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border border-white"></span>
							</div>
						}
						label="Alerts"
						isActive={activeTab === 'alerts'}
						onClick={() => changeTab('alerts')}
					/>
					<NavItem
						icon={<GearIcon weight={activeTab === 'settings' ? 'fill' : 'regular'} size={24} />}
						label="Settings"
						isActive={activeTab === 'settings'}
						onClick={() => changeTab('settings')}
					/>
				</div>
			</nav>
		</div>
	);
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
	return (
		<button
			onClick={onClick}
			className={`flex flex-col items-center justify-center w-full gap-1 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}
		>
			{icon}
			<span className="text-xs font-normal">{label}</span>
		</button>
	);
}
