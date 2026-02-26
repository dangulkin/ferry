import React from 'react';
import { CaretRightIcon, NavigationArrowIcon } from '@phosphor-icons/react';

const ROUTES = [
	{
		id: '1',
		from: 'Cacilhas',
		to: 'Cais do Sodré',
		color: 'bg-yellow-400',
		icon: true,
	},
	{
		id: '2',
		from: 'Barreiro',
		to: 'Terreiro do Paço',
		color: 'bg-sky-600',
	},
	{
		id: '3',
		from: 'Montijo',
		to: 'Cais do Sodré',
		color: 'bg-pink-600',
	},
	{
		id: '4',
		from: 'Seixal',
		to: 'Cais do Sodré',
		color: 'bg-teal-600',
	},
	{
		id: '5',
		from: 'Trafaria — Porto Brandão',
		to: 'Belém',
		color: 'bg-orange-500',
	}
];

export default function Routes({ onSelectRoute }: { onSelectRoute: (route: string) => void }) {
	return (
		<div className="flex flex-col h-full bg-gray-50">
			<header className="px-3 pt-safe pb-6 bg-gray-50 sticky top-0 z-10">
				<h1 className="text-2xl font-bold text-gray-900">Choose your route</h1>
			</header>

			<div className="flex-1 overflow-y-auto px-4">
				<div className="flex flex-col gap-3">
					{ROUTES.map((route) => (
						<button
							key={route.id}
							onClick={() => onSelectRoute(route.id)}
							className="flex items-stretch bg-white shadow-sm text-left min-h-[84px]"
						>
							<div className={`w-1.5 shrink-0 ${route.color}`} />
							<div className="flex-1 p-4 flex flex-col justify-center">
								<div className="flex items-center gap-2">
									<span className="text-base font-bold text-gray-900">{route.from}</span>
									{route.icon && <NavigationArrowIcon weight="fill" size={14} className="text-sky-600 -scale-x-100" />}
								</div>
								<span className="text-base font-bold text-gray-900 mt-1">{route.to}</span>
							</div>
						</button>
					))}

					<button
						onClick={() => onSelectRoute('all')}
						className="flex items-stretch bg-white shadow-sm border border-gray-100 text-left hover:bg-gray-50 transition-colors mt-2"
					>
						<div className="w-1.5 shrink-0 bg-gray-500" />
						<div className="flex-1 p-4 flex items-center justify-between">
							<span className="text-base font-bold text-gray-900">Show all departures</span>
							<CaretRightIcon size={20} className="text-gray-900" weight="regular" />
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}
