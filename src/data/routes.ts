export interface Route {
	id: string;
	from: string;
	to: string;
	color: string;
	borderColor: string;
	icon?: boolean;
}

export const ROUTES: Route[] = [
	{
		id: '1',
		from: 'Cacilhas',
		to: 'Cais do Sodré',
		color: 'bg-yellow-400',
		borderColor: 'border-yellow-400',
		icon: true,
	},
	{
		id: '2',
		from: 'Barreiro',
		to: 'Terreiro do Paço',
		color: 'bg-sky-600',
		borderColor: 'border-sky-600',
	},
	{
		id: '3',
		from: 'Montijo',
		to: 'Cais do Sodré',
		color: 'bg-pink-600',
		borderColor: 'border-pink-600',
	},
	{
		id: '4',
		from: 'Seixal',
		to: 'Cais do Sodré',
		color: 'bg-teal-600',
		borderColor: 'border-teal-600',
	},
	{
		id: '5',
		from: 'Trafaria — Porto Brandão',
		to: 'Belém',
		color: 'bg-orange-500',
		borderColor: 'border-orange-500',
	}
];
