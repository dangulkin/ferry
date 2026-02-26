import React from 'react';
import { LighthouseIcon, NavigationArrowIcon, ArrowsDownUpIcon } from '@phosphor-icons/react';

interface DeparturesHeaderProps {
	isSpecificRoute: boolean;
	onBack: () => void;
}

const DeparturesHeader: React.FC<DeparturesHeaderProps> = ({ isSpecificRoute, onBack }) => {
	return (
		<header className="pt-4 bg-gray-50 sticky top-0 z-10">
			<div className="h-[82px] flex items-center">
				<button
					onClick={onBack}
					className="size-10 mx-3 flex items-center justify-center text-gray-900"
				>
					<LighthouseIcon size={24} weight="regular" />
				</button>
				<div className="flex flex-1 h-full items-center">
					{isSpecificRoute ? (
						<div className="flex justify-between flex-1">
							<div className="flex flex-col border-l-4 border-yellow-400 pl-3">
								<div className="flex items-center gap-2">
									<h1 className="text-2xl font-bold text-gray-900 leading-tight">Cacilhas</h1>
									<NavigationArrowIcon weight="fill" size={16} className="text-sky-600 transform rotate-45" />
								</div>
								<h2 className="text-2xl font-bold text-gray-900 leading-tight">Cais do Sodré</h2>
							</div>
							<button className="p-2 text-gray-900 hover:bg-gray-200 rounded-full">
								<ArrowsDownUpIcon size={24} />
							</button>
						</div>
					) : (
						<div className="h-full flex-1 flex items-center border-l-6 border-gray-400 px-4">
							<h1 className="text-2xl font-bold text-gray-900">All departures</h1>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default DeparturesHeader;
