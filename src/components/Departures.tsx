import React, { useState } from 'react';
import { WarningCircle, NavigationArrow, Bicycle, Bell, ArrowsDownUp, Boat } from '@phosphor-icons/react';

const MOCK_DEPARTURES = [
  {
    id: '1',
    time: '08:25',
    timeUntil: '04 min',
    destination: 'Cacilhas',
    status: 'Boarding',
    hall: 'Sal 2',
    bikes: 5,
    color: 'bg-yellow-400',
    progress: 65,
  },
  {
    id: '2',
    time: '08:35',
    timeUntil: '14 min',
    delay: '+4 min',
    destination: 'Cais do Sodré',
    status: 'Delayed',
    hall: 'Sal 2',
    color: 'bg-yellow-400',
  },
  {
    id: '3',
    time: '08:40',
    timeUntil: '19 min',
    destination: 'Barreiro',
    status: 'Cancelled',
    hall: 'Sal 2',
    color: 'bg-gray-300',
    isCancelled: true,
  },
  {
    id: '4',
    time: '08:45',
    timeUntil: '24 min',
    destination: 'Montijo',
    status: 'On time',
    hall: 'Sal 2',
    color: 'bg-pink-600',
  },
  {
    id: '5',
    time: '09:00',
    timeUntil: '39 min',
    destination: 'Seixal',
    status: 'On time',
    hall: 'Sal 2',
    color: 'bg-teal-600',
  },
  {
    id: '6',
    time: '08:25',
    timeUntil: '24 min',
    destination: 'Cais do Sodré',
    status: 'On time',
    hall: 'Sal 2',
    color: 'bg-pink-600',
  }
];

const MOCK_ROUTE_DEPARTURES = [
  {
    id: '1',
    time: '08:25',
    timeUntil: '04 min',
    status: 'Boarding',
    hall: 'Sal 2',
    bikes: 6,
    color: 'bg-yellow-400',
    progress: 65,
  },
  {
    id: '2',
    time: '08:45',
    timeUntil: '24 min',
    delay: '+4 min',
    status: 'Delayed',
    hall: 'Sal 2',
    color: 'bg-yellow-400',
    showBell: true,
  },
  {
    id: '3',
    time: '09:05',
    timeUntil: '44 min',
    status: 'Cancelled',
    hall: 'Sal 2',
    color: 'bg-gray-300',
    isCancelled: true,
  },
  {
    id: '4',
    time: '10:45',
    timeUntil: '2h 24m',
    status: 'On time',
    hall: 'Sal 2',
    color: 'bg-yellow-400',
  },
  {
    id: '5',
    time: '11:00',
    timeUntil: '2h 39m',
    status: 'On time',
    hall: 'Sal 2',
    color: 'bg-yellow-400',
  },
  {
    id: '6',
    time: '11:20',
    timeUntil: '2h 59m',
    status: 'On time',
    hall: 'Sal 2',
    color: 'bg-yellow-400',
  }
];

export default function Departures({ selectedRoute, onSelectRoute }: { selectedRoute: string | null, onSelectRoute: () => void }) {
  const isSpecificRoute = selectedRoute && selectedRoute !== 'all';
  const departures = isSpecificRoute ? MOCK_ROUTE_DEPARTURES : MOCK_DEPARTURES;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="px-6 pt-12 pb-4 bg-gray-50 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onSelectRoute} className="w-10 h-10 flex items-center justify-center text-gray-900 bg-transparent hover:bg-gray-100 rounded-full transition-colors">
            <Boat size={28} weight="regular" />
          </button>
          <div className="flex-1">
            {isSpecificRoute ? (
              <div className="flex items-center justify-between">
                <div className="flex flex-col border-l-4 border-yellow-400 pl-3">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">Cacilhas</h1>
                    <NavigationArrow weight="fill" size={16} className="text-sky-600 transform rotate-45" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">Cais do Sodré</h2>
                </div>
                <button className="p-2 text-gray-900 hover:bg-gray-200 rounded-full">
                  <ArrowsDownUp size={24} />
                </button>
              </div>
            ) : (
              <div className="border-l-4 border-gray-400 pl-3">
                <h1 className="text-2xl font-bold text-gray-900">All departures</h1>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-6 py-4 flex gap-4 items-start">
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jan</span>
          <span className="text-2xl font-bold text-gray-900 leading-none">25</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-gray-900 font-medium">
            <WarningCircle weight="fill" className="text-gray-900" size={16} />
            <span>Severe Weather</span>
          </div>
          <p className="text-sm text-gray-500 mt-1 leading-snug">
            Severe coastal event warning. These conditions are expected by 12:00 on Tuesday 27 January.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="flex flex-col gap-0.5 bg-gray-100">
          {departures.map((dep) => (
            <DepartureCard key={dep.id} departure={dep} isSpecificRoute={isSpecificRoute} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DepartureCard({ departure, isSpecificRoute }: { departure: any, isSpecificRoute: boolean }) {
  const isCancelled = departure.isCancelled;
  const isDelayed = departure.status === 'Delayed';
  const isBoarding = departure.status === 'Boarding';

  return (
    <div className="flex bg-white relative group">
      <div className="w-16 shrink-0 flex items-start justify-center pt-4">
        <span className={`text-sm ${isCancelled ? 'text-gray-400' : 'text-gray-500'}`}>{departure.time}</span>
      </div>

      <div className={`w-1.5 shrink-0 ${departure.color}`} />

      <div className="flex-1 p-4 flex flex-col justify-center relative">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-bold ${isCancelled ? 'text-gray-400' : 'text-gray-900'}`}>
              {departure.timeUntil}
            </span>
            {departure.delay && (
              <span className="text-sm font-semibold text-red-600">{departure.delay}</span>
            )}
          </div>
          {!isSpecificRoute && departure.destination && (
            <div className="flex items-center gap-1.5">
              {departure.destination === 'Cacilhas' && <NavigationArrow weight="fill" size={14} className="text-sky-600 transform rotate-45" />}
              <span className={`text-sm font-semibold ${isCancelled ? 'text-gray-400' : 'text-gray-900'}`}>
                {departure.destination}
              </span>
              <Boat size={14} weight="fill" className={isCancelled ? 'text-gray-300' : 'text-gray-400'} />
            </div>
          )}
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isCancelled ? 'text-gray-400' : 'text-gray-500'}`}>
              {departure.status}
            </span>
            {!isCancelled && (
              <div className={`w-1.5 h-1.5 rounded-full ${isDelayed ? 'bg-red-600' : isBoarding ? 'bg-transparent' : 'bg-green-500'}`} />
            )}
            {isCancelled && <div className="w-1.5 h-1.5 rounded-full bg-red-400" />}
            
            {isBoarding && (
              <div className="flex items-center gap-1.5 ml-2">
                <div className="w-4 h-4 rounded-full border-2 border-sky-600 border-t-transparent animate-spin" />
                <span className="text-sm font-semibold text-gray-900">{departure.progress}%</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className={`text-sm ${isCancelled ? 'text-gray-300' : 'text-gray-400'}`}>
              {departure.hall}
            </span>
            {departure.bikes !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-gray-900">{departure.bikes}</span>
                <Bicycle size={16} className="text-sky-600" weight="bold" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {departure.showBell && (
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-sky-600 flex items-center justify-center">
          <Bell size={24} weight="fill" className="text-white" />
        </div>
      )}
    </div>
  );
}
