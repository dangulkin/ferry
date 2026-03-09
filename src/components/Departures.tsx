import React, { useState } from 'react';
import type { Departure } from '../types/departure';
import DeparturesHeader from './DeparturesHeader';
import AlertBanner from './AlertBanner';
import DepartureCard from './DepartureCard';
import { ROUTES } from '../data/routes';

// ── Mock data ─────────────────────────────────────────────────────────────────

// Расписание отсортировано по времени. Паромы в одно время = разные пирсы одновременно.
// Bikes и progress — только для Boarding (паром уже открыт на посадку).
// Вместимость велосипедов: малый паром — 4, средний — 9, большой — 20.
const MOCK_DEPARTURES: Departure[] = [
	// 08:25 — одновременно 3 пирса в час пик
	{ id: '1', time: '08:25', timeUntil: '04 min', destination: 'Cacilhas', status: 'Boarding', hall: 'Hall 2', bikes: 16, color: 'bg-yellow-400', progress: 78 },
	{ id: '2', time: '08:25', timeUntil: '04 min', destination: 'Barreiro', status: 'Boarding', hall: 'Hall 1', bikes: 3, color: 'bg-sky-600', progress: 91 },
	{ id: '3', time: '08:25', timeUntil: '04 min', destination: 'Montijo', status: 'Boarding', hall: 'Hall 2', bikes: 2, color: 'bg-pink-600', progress: 60 },
	// 08:35 — Cacilhas с задержкой + Seixal
	{ id: '4', time: '08:35', timeUntil: '14 min', destination: 'Cacilhas', status: 'Delayed', hall: 'Hall 2', delay: '+6 min', color: 'bg-yellow-400', showBell: true },
	{ id: '5', time: '08:35', timeUntil: '14 min', destination: 'Seixal', status: 'On time', hall: 'Hall 2', color: 'bg-teal-600' },
	// 08:40 — отменён
	{ id: '6', time: '08:40', timeUntil: '19 min', destination: 'Cais do Sodré', status: 'Cancelled', hall: 'Hall 2', color: 'bg-yellow-400', isCancelled: true },
	// 08:50 — пик: 2 пирса одновременно
	{ id: '7', time: '08:50', timeUntil: '29 min', destination: 'Cacilhas', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '8', time: '08:50', timeUntil: '29 min', destination: 'Barreiro', status: 'On time', hall: 'Hall 1', color: 'bg-sky-600' },
	// 09:00 — 3 пирса
	{ id: '9', time: '09:00', timeUntil: '39 min', destination: 'Cacilhas', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '10', time: '09:00', timeUntil: '39 min', destination: 'Montijo', status: 'On time', hall: 'Hall 1', color: 'bg-pink-600' },
	{ id: '11', time: '09:00', timeUntil: '39 min', destination: 'Seixal', status: 'On time', hall: 'Hall 2', color: 'bg-teal-600' },
	// 09:12 — Trafaria - Belém (spread)
	{ id: '28', time: '09:12', timeUntil: '12 min', destination: 'Belém', status: 'On time', hall: 'Hall 1', color: 'bg-orange-500' },
	// 09:15 — 2 пирса
	{ id: '12', time: '09:15', timeUntil: '54 min', destination: 'Cacilhas', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '13', time: '09:15', timeUntil: '54 min', destination: 'Barreiro', status: 'On time', hall: 'Hall 1', color: 'bg-sky-600' },
	// 09:30 — 2 пирса
	{ id: '14', time: '09:30', timeUntil: '1h 09m', destination: 'Cacilhas', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '15', time: '09:30', timeUntil: '1h 09m', destination: 'Seixal', status: 'On time', hall: 'Hall 2', color: 'bg-teal-600' },
	// 09:42 — Porto Brandão -> Trafaria
	{ id: '29', time: '09:42', timeUntil: '42 min', destination: 'Trafaria', status: 'On time', hall: 'Hall 1', color: 'bg-orange-500' },
	// 09:45 — 2 пирса
	{ id: '16', time: '09:45', timeUntil: '1h 24m', destination: 'Cacilhas', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '17', time: '09:45', timeUntil: '1h 24m', destination: 'Montijo', status: 'On time', hall: 'Hall 1', color: 'bg-pink-600' },
	// 10:05 — спад пика
	{ id: '18', time: '10:05', timeUntil: '1h 44m', destination: 'Cacilhas', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '19', time: '10:05', timeUntil: '1h 44m', destination: 'Barreiro', status: 'On time', hall: 'Hall 1', color: 'bg-sky-600' },
	// 10:15 — Trafaria -> Belém
	{ id: '30', time: '10:15', timeUntil: '1h 54m', destination: 'Belém', status: 'On time', hall: 'Hall 2', color: 'bg-orange-500' },
	// 10:30
	{ id: '20', time: '10:30', timeUntil: '2h 09m', destination: 'Cacilhas', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400', showBell: true },
	{ id: '21', time: '10:30', timeUntil: '2h 09m', destination: 'Seixal', status: 'On time', hall: 'Hall 2', color: 'bg-teal-600' },
	// 10:45 — Belém -> Porto Brandão
	{ id: '31', time: '10:45', timeUntil: '2h 24m', destination: 'Porto Brandão', status: 'On time', hall: 'Hall 1', color: 'bg-orange-500' },
	// 11:00
	{ id: '22', time: '11:00', timeUntil: '2h 39m', destination: 'Cacilhas', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '23', time: '11:00', timeUntil: '2h 39m', destination: 'Montijo', status: 'On time', hall: 'Hall 2', color: 'bg-pink-600' },
	// 11:15 — Belém -> Trafaria
	{ id: '32', time: '11:15', timeUntil: '2h 54m', destination: 'Trafaria', status: 'On time', hall: 'Hall 2', color: 'bg-orange-500' },
	// 11:30
	{ id: '24', time: '11:30', timeUntil: '3h 09m', destination: 'Cacilhas', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '25', time: '11:30', timeUntil: '3h 09m', destination: 'Barreiro', status: 'On time', hall: 'Hall 1', color: 'bg-sky-600' },
	// 12:00
	{ id: '26', time: '12:00', timeUntil: '3h 39m', destination: 'Cacilhas', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '27', time: '12:00', timeUntil: '3h 39m', destination: 'Seixal', status: 'On time', hall: 'Hall 2', color: 'bg-teal-600' },
];

const MOCK_ROUTE_DEPARTURES: Departure[] = [
	{ id: '1', time: '08:25', timeUntil: '04 min', status: 'Boarding', hall: 'Hall 2', bikes: 6, color: 'bg-yellow-400', progress: 85 },
	{ id: '2', time: '08:35', timeUntil: '14 min', delay: '+4 min', status: 'Delayed', hall: 'Hall 2', color: 'bg-yellow-400', showBell: true },
	{ id: '3', time: '08:50', timeUntil: '29 min', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '4', time: '09:05', timeUntil: '44 min', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '5', time: '09:20', timeUntil: '59 min', status: 'On time', hall: 'Hall 2', bikes: 8, color: 'bg-yellow-400' },
	{ id: '6', time: '09:40', timeUntil: '1h 19m', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '7', time: '10:00', timeUntil: '1h 39m', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '8', time: '10:20', timeUntil: '1h 59m', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '9', time: '10:40', timeUntil: '2h 19m', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '10', time: '11:00', timeUntil: '2h 39m', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '11', time: '11:20', timeUntil: '2h 59m', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '12', time: '11:40', timeUntil: '3h 19m', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
	{ id: '13', time: '12:00', timeUntil: '3h 39m', status: 'On time', hall: 'Hall 2', color: 'bg-yellow-400' },
];

// ── Departures ────────────────────────────────────────────────────────────────

interface DeparturesProps {
	selectedRoute: string | null;
	onSelectRoute: () => void;
	onSwapDirection?: () => void;
}

export default function Departures({ selectedRoute, onSelectRoute, onSwapDirection }: DeparturesProps) {
	const isSpecificRoute = !!(selectedRoute && selectedRoute !== 'all');
	const [openCardId, setOpenCardId] = useState<string | null>(null);

	// Filtering logic based on selectedRoute (which is the route id)
	const getDepartures = () => {
		if (!isSpecificRoute) return MOCK_DEPARTURES;

		const currentRoute = ROUTES.find(r => r.id === selectedRoute);
		if (!currentRoute) return MOCK_DEPARTURES;

		const destName = currentRoute.to;
		const fromNames = Array.isArray(currentRoute.from) ? currentRoute.from : [currentRoute.from];

		return MOCK_DEPARTURES.filter(d => {
			if (currentRoute.id === '5') {
				// For the orange three-stop route, any destination in the route is a match
				return d.destination === 'Belém' || d.destination === 'Trafaria' || d.destination === 'Porto Brandão';
			}
			return d.destination === destName;
		});
	};

	const departures = getDepartures();

	return (
		<div className="flex flex-col gap-4 h-full bg-app-background">
			<DeparturesHeader isSpecificRoute={isSpecificRoute} routeId={selectedRoute} onBack={onSelectRoute} onSwapDirection={onSwapDirection} />

			<AlertBanner
				month="Jan"
				day={25}
				title="Severe Weather"
				description="Severe coastal event warning. These conditions are expected by 12:00 on Tuesday 27 January."
			/>

			<div
				className="flex-1 overflow-y-auto no-scrollbar"
			>
				<div className="flex flex-col gap-px pb-4">
					{departures.map((dep, index) => (
						<DepartureCard
							key={dep.id}
							departure={dep}
							isSpecificRoute={isSpecificRoute}
							isFirst={index === 0}
							isOpen={openCardId === dep.id}
							onToggle={(isOpen) => setOpenCardId(isOpen ? dep.id : null)}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
