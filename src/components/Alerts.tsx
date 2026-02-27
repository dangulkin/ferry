import React, { useState } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';

const ALERTS = [
	{
		id: '1',
		date: '11',
		month: 'FEB',
		title: 'Upcoming strike',
		summary: 'Ferry services are expected to be suspended on Wednesday due to a pla...',
		color: 'bg-gray-400',
	},
	{
		id: '2',
		date: '28',
		month: 'JAN',
		title: 'Service disruptions',
		summary: 'Minor service disruptions are affecting some departures today. Expect short...',
		color: 'bg-sky-600',
	},
	{
		id: '3',
		date: '28',
		month: 'JAN',
		title: 'Planned pier maintenance',
		summary: 'Reduced boarding capacity is expected due to maintenance works at the pier....',
		color: 'bg-yellow-400',
	},
	{
		id: '4',
		date: '25',
		month: 'JAN',
		title: 'Severe Weather',
		summary: 'Severe coastal conditions are expected from Tuesday afternoon. Crossings m...',
		color: 'bg-gray-400',
	},
	{
		id: '5',
		date: '24',
		month: 'JAN',
		title: 'Service running normally',
		summary: 'Previous disruptions have been resolved. Ferry services are operating...',
		color: 'bg-pink-600',
	}
];

export default function Alerts() {
	const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

	if (selectedAlert) {
		return <AlertDetail onBack={() => setSelectedAlert(null)} />;
	}

	return (
		<div className="flex flex-col h-full bg-app-background">
			<header className="px-3 pt-safe pb-6 bg-app-background sticky top-0 z-10">
				<h1 className="text-2xl font-bold text-gray-900 pt-4">Alerts</h1>
			</header>

			<div className="flex-1 overflow-y-auto px-4">
				<div className="flex flex-col gap-px pb-8">
					{ALERTS.map((alert) => (
						<button
							key={alert.id}
							onClick={() => setSelectedAlert(alert.id)}
							className="flex items-stretch bg-transparent text-left"
						>
							<div className="flex-1 bg-white rounded-lg p-1 flex items-stretch">
								<div className={`w-1.5 shrink-0 rounded-full ${alert.color}`} />
								<div className="flex-1 p-4 flex flex-col justify-center">
									<div className="flex justify-between items-start mb-1">
										<h3 className="text-base font-bold text-gray-900 leading-tight">{alert.title}</h3>
										<div className="flex flex-col items-end shrink-0 ml-4">
											<span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">{alert.month}</span>
											<span className="text-lg font-bold text-gray-900 leading-none">{alert.date}</span>
										</div>
									</div>
									<p className="text-sm text-gray-500 leading-tight line-clamp-2">{alert.summary}</p>
								</div>
							</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

function AlertDetail({ onBack }: { onBack: () => void }) {
	return (
		<div className="flex flex-col h-full bg-white">
			<header className="px-3 pt-safe pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
				<div className="pt-4 flex items-center gap-4">
					<button onClick={onBack} className="p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
						<ArrowLeft size={24} weight="regular" />
					</button>
					<h1 className="text-xl font-bold text-gray-900">Alert detail</h1>
				</div>
			</header>

			<div className="flex-1 overflow-y-auto p-6">
				<span className="text-sm text-gray-500 mb-2 block">28 January 2026</span>
				<h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
					Service disruptions on Barreiro — Terreiro do Paço
				</h2>

				<section className="mb-8">
					<h3 className="text-base font-medium text-gray-900 mb-3">Summary</h3>
					<p className="text-base text-gray-600 leading-relaxed">
						Minor service disruptions are affecting some departures today. Expect short delays during peak hours.
					</p>
				</section>

				<hr className="border-gray-100 mb-8" />

				<section className="mb-8">
					<h3 className="text-base font-medium text-gray-900 mb-3">What's happening</h3>
					<p className="text-base text-gray-600 leading-relaxed">
						Several vessels are currently unavailable due to technical maintenance. As a result, it may not be possible to operate all planned departures during periods of high demand.
						<br /><br />
						To reduce the impact of cancellations and long waiting times, some ferries may depart earlier than scheduled once maximum passenger capacity is reached.
					</p>
				</section>

				<hr className="border-gray-100 mb-8" />

				<section>
					<h3 className="text-base font-medium text-gray-900 mb-3">What this means for you</h3>
					<ul className="list-disc pl-5 text-base text-gray-600 leading-relaxed space-y-2">
						<li>Some departures may not follow the published timetable</li>
						<li>Waiting times during peak hours may be longer than usual</li>
						<li>Boarding may close earlier than expected on certain crossings</li>
					</ul>
				</section>
			</div>
		</div>
	);
}
