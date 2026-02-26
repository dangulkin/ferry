import React from 'react';
import { WarningIcon } from '@phosphor-icons/react';

interface AlertBannerProps {
	month: string;
	day: number;
	title: string;
	description: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ month, day, title, description }) => {
	return (
		<div className="flex gap-1 items-start">
			<div className="w-10 mx-3 flex flex-col items-center">
				<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{month}</span>
				<span className="text-2xl font-bold text-gray-900 leading-none">{day}</span>
			</div>
			<div className="flex flex-col gap-2 flex-1 px-4">
				<div className="flex items-center gap-1 text-gray-900 font-medium">
					<WarningIcon weight="fill" className="text-gray-900" size={16} />
					<span>{title}</span>
				</div>
				<p className="text-sm text-gray-500 leading-snug">
					{description}
				</p>
			</div>
		</div>
	);
};

export default AlertBanner;
