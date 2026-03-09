import React from 'react';
import { LighthouseIcon, NavigationArrowIcon, ArrowsDownUpIcon } from '@phosphor-icons/react';
import { ROUTES } from '../data/routes';

interface DeparturesHeaderProps {
	isSpecificRoute: boolean;
	routeId: string | null;
	onBack: () => void;
	onSwapDirection?: () => void;
}

const DeparturesHeader: React.FC<DeparturesHeaderProps> = ({ isSpecificRoute, routeId, onBack, onSwapDirection }) => {
	const currentRoute = ROUTES.find(r => r.id === routeId);

	return (
		<header className="pt-safe bg-app-background sticky top-0 z-10">
			<div className="pt-4 h-[98px] py-2 flex items-center gap-1">
				<button
					onClick={onBack}
					className="size-10 mx-3 shrink-0 flex items-center justify-center text-gray-900 hover:bg-gray-200 rounded-full"
				>
					<LighthouseIcon size={24} weight="bold" />
				</button>
				<div className="flex flex-1 items-center h-full">
					{isSpecificRoute && currentRoute ? (
						<div className="flex items-center justify-between flex-1">
							<div className="flex items-stretch gap-2 h-full">
								<div className={`w-1.5 rounded-full shrink-0 ${currentRoute.color} h-full`} />
								<div className="flex flex-col justify-center h-full">
									{Array.isArray(currentRoute.from) ? (
										currentRoute.from.map((stop, idx) => (
											<h1 key={idx} className="text-2xl font-bold text-gray-900 leading-tight">{stop}</h1>
										))
									) : (
										<div className="flex items-center gap-2">
											<h1 className="text-2xl font-bold text-gray-900 leading-tight">{currentRoute.from}</h1>
											<NavigationArrowIcon weight="fill" size={16} className="text-sky-600 -scale-x-100" />
										</div>
									)}
									<h2 className="text-2xl font-bold text-gray-900 leading-tight">{currentRoute.to}</h2>
								</div>
							</div>
							<button 
								onClick={onSwapDirection}
								className="size-10 mx-3 shrink-0 flex items-center justify-center text-gray-900 hover:bg-gray-200 rounded-full"
							>
								<ArrowsDownUpIcon size={24} weight="bold" />
							</button>
						</div>
					) : (
						<div className="h-full flex-1 flex items-stretch gap-2">
							<div className="w-1.5 rounded-full shrink-0 bg-gray-500 " />
							<div className="flex items-center">
								<h1 className="text-2xl font-bold text-gray-900 leading-none">All departures</h1>
							</div>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default DeparturesHeader;
