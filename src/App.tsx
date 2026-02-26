import React, { useState } from 'react';
import { LighthouseIcon, WarningIcon, GearIcon } from '@phosphor-icons/react';

import { BoatIcon } from './components/icons/BoatIcon';
import Departures from './components/Departures';
import Routes from './components/Routes';
import Alerts from './components/Alerts';
import Settings from './components/Settings';

export default function App() {
	const [activeTab, setActiveTab] = useState('departures');
	const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

	const renderContent = () => {
		switch (activeTab) {
			case 'departures':
				return <Departures selectedRoute={selectedRoute} onSelectRoute={() => setActiveTab('routes')} />;
			case 'routes':
				return <Routes onSelectRoute={(route) => { setSelectedRoute(route); setActiveTab('departures'); }} />;
			case 'alerts':
				return <Alerts />;
			case 'settings':
				return <Settings />;
			default:
				return <Departures selectedRoute={selectedRoute} onSelectRoute={() => setActiveTab('routes')} />;
		}
	};

	return (
		<div className="flex flex-col h-dvh bg-gray-50 font-sans text-gray-900 max-w-md mx-auto overflow-hidden relative shadow-xl">
			<main className="flex-1 overflow-y-auto pb-20">
				{renderContent()}
			</main>

			<nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-md w-full bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-around items-center pb-safe pt-2 px-2 z-50">
				<NavItem
					icon={<BoatIcon filled={activeTab === 'departures'} size={24} />}
					label="Departures"
					isActive={activeTab === 'departures'}
					onClick={() => setActiveTab('departures')}
				/>
				<NavItem
					icon={<LighthouseIcon weight={activeTab === 'routes' ? 'fill' : 'regular'} size={24} />}
					label="Routes"
					isActive={activeTab === 'routes'}
					onClick={() => setActiveTab('routes')}
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
					onClick={() => setActiveTab('alerts')}
				/>
				<NavItem
					icon={<GearIcon weight={activeTab === 'settings' ? 'fill' : 'regular'} size={24} />}
					label="Settings"
					isActive={activeTab === 'settings'}
					onClick={() => setActiveTab('settings')}
				/>
			</nav>
		</div>
	);
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
	return (
		<button
			onClick={onClick}
			className={`flex flex-col items-center justify-center w-full gap-1 ${isActive ? 'text-sky-600' : 'text-gray-500 hover:text-gray-700'}`}
		>
			{icon}
			<span className="text-xs font-normal">{label}</span>
		</button>
	);
}
