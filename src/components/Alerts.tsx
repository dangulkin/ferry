import React, { useState } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';

const ALERTS = [
	{
		id: '1',
		date: '11',
		month: 'FEB',
		year: '2026',
		title: 'Upcoming strike',
		summary: 'Ferry services are expected to be suspended on Wednesday due to a pla...',
		color: 'bg-gray-400',
		details: {
			title: 'Strike action on Wednesday 11 February',
			summary: 'Ferry services are expected to be suspended on Wednesday due to a planned strike action by transport workers.',
			description: 'Due to national trade union action, we expect significant disruptions across our entire network on Wednesday. Most crossings will be cancelled throughout the day.',
			impact: [
				'All routes will experience severe cancellations',
				'A limited emergency service may operate on certain routes',
				'Check the app for real-time updates before travelling'
			]
		}
	},
	{
		id: '2',
		date: '28',
		month: 'JAN',
		year: '2026',
		title: 'Service disruptions',
		summary: 'Minor service disruptions are affecting some departures today. Expect short...',
		color: 'bg-sky-600',
		details: {
			title: 'Service disruptions on Barreiro — Terreiro do Paço',
			summary: 'Minor service disruptions are affecting some departures today. Expect short delays during peak hours.',
			description: 'Several vessels are currently unavailable due to technical maintenance. As a result, it may not be possible to operate all planned departures during periods of high demand.',
			impact: [
				'Some departures may not follow the published timetable',
				'Waiting times during peak hours may be longer than usual',
				'Boarding may close earlier than expected on certain crossings'
			]
		}
	},
	{
		id: '3',
		date: '28',
		month: 'JAN',
		year: '2026',
		title: 'Planned pier maintenance',
		summary: 'Reduced boarding capacity is expected due to maintenance works at the pier....',
		color: 'bg-yellow-400',
		details: {
			title: 'Maintenance works at Cais do Sodré pier',
			summary: 'Reduced boarding capacity is expected due to maintenance works at the pier starting this week.',
			description: 'We are performing essential maintenance on the boarding ramps at Cais do Sodré. While we aim to keep all services running, some boarding areas will be narrower than usual.',
			impact: [
				'Boarding may take longer than scheduled',
				'Please follow staff instructions at the terminal',
				'Bicycle capacity might be further restricted'
			]
		}
	},
	{
		id: '4',
		date: '25',
		month: 'JAN',
		year: '2026',
		title: 'Severe Weather',
		summary: 'Severe coastal conditions are expected from Tuesday afternoon. Crossings m...',
		color: 'bg-gray-400',
		details: {
			title: 'Severe Weather Alert: High Winds and Swell',
			summary: 'Severe coastal conditions are expected from Tuesday afternoon. Crossings may be suspended for safety.',
			description: 'A strong storm system is moving into the Tagus estuary. High winds and significant wave heights are forecast, which may make docking unsafe at several terminals.',
			impact: [
				'Crossings may be suspended at short notice',
				'Expect delays on all river crossings',
				'Safety is our priority; thank you for your patience'
			]
		}
	},
	{
		id: '5',
		date: '24',
		month: 'JAN',
		year: '2026',
		title: 'Service running normally',
		summary: 'Previous disruptions have been resolved. Ferry services are operating...',
		color: 'bg-pink-600',
		details: {
			title: 'All services restored across the network',
			summary: 'Previous disruptions have been resolved. Ferry services are operating according to the standard timetable.',
			description: 'The technical issues affecting our fleet have been resolved. All vessels are back in service, and we are now operating our regular schedule on all routes.',
			impact: [
				'No current delays or cancellations reported',
				'All terminals are operating at full capacity',
				'Standard boarding procedures apply'
			]
		}
	}
];

export default function Alerts() {
	const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

	const selectedAlert = ALERTS.find(a => a.id === selectedAlertId);

	if (selectedAlert) {
		return <AlertDetail alert={selectedAlert} onBack={() => setSelectedAlertId(null)} />;
	}

	return (
		<div className="flex flex-col h-full bg-app-background">
			<header className="px-4 pt-safe pb-6 bg-app-background sticky top-0 z-10">
				<h1 className="text-2xl font-bold text-gray-900 pt-4">Alerts</h1>
			</header>

			<div className="flex-1 overflow-y-auto no-scrollbar px-4">
				<div className="flex flex-col gap-px pb-8">
					{ALERTS.map((alert) => (
						<button
							key={alert.id}
							onClick={() => setSelectedAlertId(alert.id)}
							className="flex items-stretch bg-transparent text-left"
						>
							<div className="flex-1 bg-white rounded-lg p-1 flex items-stretch">
								<div className={`w-1.5 shrink-0 rounded-full ${alert.color}`} />
								{/* Date Block */}
								<div className="w-14 shrink-0 flex flex-col items-center justify-center">
									<span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">{alert.month}</span>
									<span className="text-xl font-bold text-gray-900 leading-tight mt-1">{alert.date}</span>
								</div>
								{/* Divider */}
								<div className="w-px my-3 bg-gray-100 shrink-0" />
								{/* Content */}
								<div className="flex-1 p-4 flex flex-col justify-center">
									<h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{alert.title}</h3>
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

function AlertDetail({ alert, onBack }: { alert: typeof ALERTS[0], onBack: () => void }) {
	return (
		<div className="flex flex-col h-full bg-white">
			<header className="px-4 pt-safe pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
				<div className="pt-4 flex items-center gap-4">
					<button onClick={onBack} className="p-2 -ml-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
						<ArrowLeft size={24} weight="regular" />
					</button>
					<h1 className="text-xl font-bold text-gray-900">Alert detail</h1>
				</div>
			</header>

			<div className="flex-1 overflow-y-auto no-scrollbar p-6">
				<span className="text-sm text-gray-500 mb-2 block">{alert.date} {alert.month === 'JAN' ? 'January' : 'February'} {alert.year}</span>
				<h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
					{alert.details.title}
				</h2>

				<section className="mb-8">
					<h3 className="text-base font-medium text-gray-900 mb-3">Summary</h3>
					<p className="text-base text-gray-600 leading-relaxed">
						{alert.details.summary}
					</p>
				</section>

				<hr className="border-gray-100 mb-8" />

				<section className="mb-8">
					<h3 className="text-base font-medium text-gray-900 mb-3">What's happening</h3>
					<p className="text-base text-gray-600 leading-relaxed">
						{alert.details.description}
					</p>
				</section>

				<hr className="border-gray-100 mb-8" />

				<section>
					<h3 className="text-base font-medium text-gray-900 mb-3">What this means for you</h3>
					<ul className="list-disc pl-5 text-base text-gray-600 leading-relaxed space-y-2">
						{alert.details.impact.map((item, idx) => (
							<li key={idx}>{item}</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
