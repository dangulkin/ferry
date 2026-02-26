import type { Departure } from '../types/departure';
import DeparturesHeader from './DeparturesHeader';
import AlertBanner from './AlertBanner';
import DepartureCard from './DepartureCard';

// ── Mock data ─────────────────────────────────────────────────────────────────

// Расписание отсортировано по времени. Паромы в одно время = разные пирсы одновременно.
// Bikes и progress — только для Boarding (паром уже открыт на посадку).
// Вместимость велосипедов: малый паром — 4, средний — 9, большой — 20.
const MOCK_DEPARTURES: Departure[] = [
	// 08:25 — одновременно 3 пирса в час пик
	{ id: '1', time: '08:25', timeUntil: '04 min', destination: 'Cacilhas', status: 'Boarding', hall: 'Cais 4', bikes: 16, color: 'bg-yellow-400', progress: 78 },
	{ id: '2', time: '08:25', timeUntil: '04 min', destination: 'Barreiro', status: 'Boarding', hall: 'Cais 7', bikes: 3, color: 'bg-sky-600', progress: 91 },
	{ id: '3', time: '08:25', timeUntil: '04 min', destination: 'Montijo', status: 'Boarding', hall: 'Cais 8', bikes: 2, color: 'bg-pink-600', progress: 60 },
	// 08:35 — Cacilhas с задержкой + Seixal
	{ id: '4', time: '08:35', timeUntil: '14 min', destination: 'Cacilhas', status: 'Delayed', hall: 'Cais 4', delay: '+6 min', color: 'bg-yellow-400', showBell: true },
	{ id: '5', time: '08:35', timeUntil: '14 min', destination: 'Seixal', status: 'On time', hall: 'Cais 6', color: 'bg-teal-600' },
	// 08:40 — отменён
	{ id: '6', time: '08:40', timeUntil: '19 min', destination: 'Cais do Sodré', status: 'Cancelled', hall: 'Cais 3', color: 'bg-yellow-400', isCancelled: true },
	// 08:50 — пик: 2 пирса одновременно
	{ id: '7', time: '08:50', timeUntil: '29 min', destination: 'Cacilhas', status: 'On time', hall: 'Cais 5', color: 'bg-yellow-400' },
	{ id: '8', time: '08:50', timeUntil: '29 min', destination: 'Barreiro', status: 'On time', hall: 'Cais 7', color: 'bg-sky-600' },
	// 09:00 — 3 пирса
	{ id: '9', time: '09:00', timeUntil: '39 min', destination: 'Cacilhas', status: 'On time', hall: 'Cais 4', color: 'bg-yellow-400' },
	{ id: '10', time: '09:00', timeUntil: '39 min', destination: 'Montijo', status: 'On time', hall: 'Cais 8', color: 'bg-pink-600' },
	{ id: '11', time: '09:00', timeUntil: '39 min', destination: 'Seixal', status: 'On time', hall: 'Cais 6', color: 'bg-teal-600' },
	// 09:15 — 2 пирса
	{ id: '12', time: '09:15', timeUntil: '54 min', destination: 'Cacilhas', status: 'On time', hall: 'Cais 4', color: 'bg-yellow-400' },
	{ id: '13', time: '09:15', timeUntil: '54 min', destination: 'Barreiro', status: 'On time', hall: 'Cais 7', color: 'bg-sky-600' },
	// 09:30 — 2 пирса
	{ id: '14', time: '09:30', timeUntil: '1h 09m', destination: 'Cacilhas', status: 'On time', hall: 'Cais 5', color: 'bg-yellow-400' },
	{ id: '15', time: '09:30', timeUntil: '1h 09m', destination: 'Seixal', status: 'On time', hall: 'Cais 6', color: 'bg-teal-600' },
	// 09:45 — 2 пирса
	{ id: '16', time: '09:45', timeUntil: '1h 24m', destination: 'Cacilhas', status: 'On time', hall: 'Cais 4', color: 'bg-yellow-400' },
	{ id: '17', time: '09:45', timeUntil: '1h 24m', destination: 'Montijo', status: 'On time', hall: 'Cais 8', color: 'bg-pink-600' },
	// 10:05 — спад пика, частота снижается; один маршрут
	{ id: '18', time: '10:05', timeUntil: '1h 44m', destination: 'Cacilhas', status: 'On time', hall: 'Cais 4', color: 'bg-yellow-400' },
	{ id: '19', time: '10:05', timeUntil: '1h 44m', destination: 'Barreiro', status: 'On time', hall: 'Cais 7', color: 'bg-sky-600' },
	// 10:30
	{ id: '20', time: '10:30', timeUntil: '2h 09m', destination: 'Cacilhas', status: 'On time', hall: 'Cais 4', color: 'bg-yellow-400', showBell: true },
	{ id: '21', time: '10:30', timeUntil: '2h 09m', destination: 'Seixal', status: 'On time', hall: 'Cais 6', color: 'bg-teal-600' },
	// 11:00
	{ id: '22', time: '11:00', timeUntil: '2h 39m', destination: 'Cacilhas', status: 'On time', hall: 'Cais 5', color: 'bg-yellow-400' },
	{ id: '23', time: '11:00', timeUntil: '2h 39m', destination: 'Montijo', status: 'On time', hall: 'Cais 8', color: 'bg-pink-600' },
	// 11:30
	{ id: '24', time: '11:30', timeUntil: '3h 09m', destination: 'Cacilhas', status: 'On time', hall: 'Cais 4', color: 'bg-yellow-400' },
	{ id: '25', time: '11:30', timeUntil: '3h 09m', destination: 'Barreiro', status: 'On time', hall: 'Cais 7', color: 'bg-sky-600' },
	// 12:00
	{ id: '26', time: '12:00', timeUntil: '3h 39m', destination: 'Cacilhas', status: 'On time', hall: 'Cais 4', color: 'bg-yellow-400' },
	{ id: '27', time: '12:00', timeUntil: '3h 39m', destination: 'Seixal', status: 'On time', hall: 'Cais 6', color: 'bg-teal-600' },
];

const MOCK_ROUTE_DEPARTURES: Departure[] = [
	{ id: '1', time: '08:25', timeUntil: '04 min', status: 'Boarding', hall: 'Sal 2', bikes: 6, color: 'bg-yellow-400', progress: 85 },
	{ id: '2', time: '08:35', timeUntil: '14 min', delay: '+4 min', status: 'Delayed', hall: 'Sal 2', color: 'bg-yellow-400', showBell: true },
	{ id: '3', time: '08:50', timeUntil: '29 min', status: 'On time', hall: 'Sal 2', color: 'bg-yellow-400' },
	{ id: '4', time: '09:05', timeUntil: '44 min', status: 'On time', hall: 'Sal 2', color: 'bg-yellow-400' },
	{ id: '5', time: '09:20', timeUntil: '59 min', status: 'On time', hall: 'Sal 2', bikes: 8, color: 'bg-yellow-400' },
	{ id: '6', time: '09:40', timeUntil: '1h 19m', status: 'On time', hall: 'Sal 2', color: 'bg-yellow-400' },
	{ id: '7', time: '10:00', timeUntil: '1h 39m', status: 'On time', hall: 'Sal 2', color: 'bg-yellow-400' },
	{ id: '8', time: '10:20', timeUntil: '1h 59m', status: 'On time', hall: 'Sal 2', color: 'bg-yellow-400' },
	{ id: '9', time: '10:40', timeUntil: '2h 19m', status: 'On time', hall: 'Sal 2', color: 'bg-yellow-400' },
	{ id: '10', time: '11:00', timeUntil: '2h 39m', status: 'On time', hall: 'Sal 2', color: 'bg-yellow-400' },
	{ id: '11', time: '11:20', timeUntil: '2h 59m', status: 'On time', hall: 'Sal 2', color: 'bg-yellow-400' },
	{ id: '12', time: '11:40', timeUntil: '3h 19m', status: 'On time', hall: 'Sal 2', color: 'bg-yellow-400' },
	{ id: '13', time: '12:00', timeUntil: '3h 39m', status: 'On time', hall: 'Sal 2', color: 'bg-yellow-400' },
];

// ── Departures ────────────────────────────────────────────────────────────────

interface DeparturesProps {
	selectedRoute: string | null;
	onSelectRoute: () => void;
}

export default function Departures({ selectedRoute, onSelectRoute }: DeparturesProps) {
	const isSpecificRoute = !!(selectedRoute && selectedRoute !== 'all');
	const departures = isSpecificRoute ? MOCK_ROUTE_DEPARTURES : MOCK_DEPARTURES;

	return (
		<div className="flex flex-col gap-4 h-full bg-gray-50">
			<DeparturesHeader isSpecificRoute={isSpecificRoute} onBack={onSelectRoute} />

			<AlertBanner
				month="Jan"
				day={25}
				title="Severe Weather"
				description="Severe coastal event warning. These conditions are expected by 12:00 on Tuesday 27 January."
			/>

			<div
				className="flex-1 overflow-y-auto"
			>
				<div className="flex flex-col gap-px">
					{departures.map((dep, index) => (
						<DepartureCard
							key={dep.id}
							departure={dep}
							isSpecificRoute={isSpecificRoute}
							isFirst={index === 0}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
