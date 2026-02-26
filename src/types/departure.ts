export interface Departure {
	id: string;
	time: string;
	timeUntil: string;
	destination?: string;
	status: string;
	hall: string;
	bikes?: number;
	color: string;
	progress?: number;
	delay?: string;
	isCancelled?: boolean;
	showBell?: boolean;
}
