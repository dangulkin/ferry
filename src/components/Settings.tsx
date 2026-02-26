import React, { useState } from 'react';
import { CaretRight, Sun, Moon, Plus, Bell, CalendarBlank, Wrench, ClockCounterClockwise, Archive, Globe, Info, EnvelopeSimple, FileText, WrenchIcon, ClockCounterClockwiseIcon, ArchiveIcon, GlobeIcon, InfoIcon, EnvelopeSimpleIcon, FileTextIcon, SunIcon, MoonIcon, BellIcon, CalendarBlankIcon } from '@phosphor-icons/react';

export default function Settings() {
	const [upcomingDisruptions, setUpcomingDisruptions] = useState(true);
	const [showRestored, setShowRestored] = useState(false);
	const [archiveAfter, setArchiveAfter] = useState('24h');

	return (
		<div className="flex flex-col h-full bg-gray-50">
			<header className="px-3 pt-12 pb-6 bg-gray-50 sticky top-0 z-10">
				<h1 className="text-2xl font-bold text-gray-900">Settings</h1>
			</header>

			<div className="flex-1 overflow-y-auto px-4 pb-6 space-y-8">

				{/* Commutes Section */}
				<section>
					<h2 className="text-sm font-medium text-gray-500 mb-3 px-2">Commutes</h2>
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
						<SettingsItem icon={<SunIcon size={20} weight="bold" />} label="Morning" value="7:00 — 8:30" />
						<div className="h-px bg-gray-100 ml-12" />
						<SettingsItem icon={<MoonIcon size={20} weight="bold" />} label="Evening" value="18:30 — 20:00" />
						<div className="h-px bg-gray-100 ml-12" />
						<button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors">
							<div className="flex items-center gap-3 text-sky-600">
								<Plus size={20} weight="bold" />
								<span className="text-base font-medium">Add commute</span>
							</div>
							<CaretRight size={16} className="text-sky-600" />
						</button>
					</div>
				</section>

				{/* Notifications Section */}
				<section>
					<h2 className="text-sm font-medium text-gray-500 mb-3 px-2">Notifications</h2>
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
						<SettingsItem icon={<BellIcon size={20} weight="bold" />} label="Notify me" value="15 min" />
						<div className="h-px bg-gray-100 ml-12" />
						<SettingsItem icon={<CalendarBlankIcon size={20} weight="bold" />} label="Days" value="Mon, Tue, Wen, Thu, Fri" />
					</div>
				</section>

				{/* Alerts & information Section */}
				<section>
					<h2 className="text-sm font-medium text-gray-500 mb-3 px-2">Alerts & information</h2>
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
						<div className="flex items-center justify-between px-4 py-3.5">
							<div className="flex items-center gap-3 text-gray-900">
								<WrenchIcon size={20} weight="bold" className="text-gray-500" />
								<span className="text-base font-medium">Upcoming disruptions</span>
							</div>
							<Toggle checked={upcomingDisruptions} onChange={setUpcomingDisruptions} />
						</div>
						<div className="h-px bg-gray-100 ml-12" />
						<div className="flex items-center justify-between px-4 py-3.5">
							<div className="flex items-center gap-3 text-gray-900">
								<ClockCounterClockwiseIcon size={20} weight="bold" className="text-gray-500" />
								<span className="text-base font-medium">Show restored alerts</span>
							</div>
							<Toggle checked={showRestored} onChange={setShowRestored} />
						</div>
						<div className="h-px bg-gray-100 ml-12" />
						<div className="px-4 py-4">
							<div className="flex items-center gap-3 text-gray-900 mb-3">
								<ArchiveIcon size={20} weight="bold" className="text-gray-500" />
								<span className="text-base font-medium">Auto-archive resolved alerts after</span>
							</div>
							<div className="flex gap-2">
								{['24h', '48h', '7d'].map((option) => (
									<button
										key={option}
										onClick={() => setArchiveAfter(option)}
										className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${archiveAfter === option
												? 'bg-sky-600 text-white'
												: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
											}`}
									>
										{option}
									</button>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* About & support Section */}
				<section>
					<h2 className="text-sm font-medium text-gray-900 mb-3 px-2">About & support</h2>
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
						<SettingsItem icon={<GlobeIcon size={20} weight="bold" />} label="Language" value="EN" />
						<div className="h-px bg-gray-100 ml-12" />
						<SettingsItem icon={<InfoIcon size={20} weight="bold" />} label="About the service" />
						<div className="h-px bg-gray-100 ml-12" />
						<SettingsItem icon={<EnvelopeSimpleIcon size={20} weight="bold" />} label="Contact support" />
						<div className="h-px bg-gray-100 ml-12" />
						<SettingsItem icon={<FileTextIcon size={20} weight="bold" />} label="Terms & privacy" />
					</div>
				</section>

			</div>
		</div>
	);
}

function SettingsItem({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
	return (
		<button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors">
			<div className="flex items-center gap-3 text-gray-900">
				<span className="text-gray-500">{icon}</span>
				<span className="text-base font-medium">{label}</span>
			</div>
			<div className="flex items-center gap-2">
				{value && <span className="text-sm text-gray-400">{value}</span>}
				<CaretRight size={16} className="text-gray-400" />
			</div>
		</button>
	);
}

function Toggle({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) {
	return (
		<button
			onClick={() => onChange(!checked)}
			className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${checked ? 'bg-green-500' : 'bg-gray-200'
				}`}
		>
			<div
				className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'
					}`}
			/>
		</button>
	);
}
