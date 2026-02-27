import React from 'react';
import { CaretRightIcon, NavigationArrowIcon } from '@phosphor-icons/react';
import { ROUTES } from '../data/routes';


export default function Routes({ onSelectRoute }: { onSelectRoute: (route: string) => void }) {
	return (
		<div className="flex flex-col h-full bg-app-background">
			<header className="px-4 pt-safe pb-6 bg-app-background sticky top-0 z-10">
				<h1 className="text-2xl font-bold text-gray-900 pt-4">Choose your route</h1>
			</header>

			<div className="flex-1 overflow-y-auto no-scrollbar px-4">
				<div className="flex flex-col gap-px pb-8">
					{ROUTES.map((route) => (
						<button
							key={route.id}
							onClick={() => onSelectRoute(route.id)}
							className="flex items-stretch bg-transparent text-left min-h-[92px]"
						>
							<div className="flex-1 bg-white rounded-lg p-1 flex items-stretch">
								<div className={`w-1.5 shrink-0 rounded-full ${route.color}`} />
								<div className="flex-1 py-3 px-4 flex flex-col justify-center">
									<div className="flex flex-col">
										{Array.isArray(route.from) ? (
											route.from.map((stop, idx) => (
												<span key={idx} className="text-base font-bold text-gray-900 leading-tight">{stop}</span>
											))
										) : (
											<div className="flex items-center gap-2">
												<span className="text-base font-bold text-gray-900 leading-tight">{route.from}</span>
												{route.icon && <NavigationArrowIcon weight="fill" size={14} className="text-sky-600 -scale-x-100" />}
											</div>
										)}
									</div>
									<span className="text-base font-bold text-gray-900 mt-1 leading-tight">{route.to}</span>
								</div>
							</div>
						</button>
					))}

					<button
						onClick={() => onSelectRoute('all')}
						className="flex items-stretch bg-transparent text-left mt-2 min-h-[64px]"
					>
						<div className="flex-1 bg-white rounded-lg p-1 flex items-stretch">
							<div className="w-1.5 shrink-0 bg-gray-500 rounded-full" />
							<div className="flex-1 py-3 px-4 flex items-center justify-between">
								<span className="text-base font-bold text-gray-900">Show all departures</span>
								<CaretRightIcon size={20} className="text-gray-900" weight="regular" />
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}
