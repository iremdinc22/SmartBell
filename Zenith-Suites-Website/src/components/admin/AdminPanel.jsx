import { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const reservations = [
    { id: '#ZNTH8432', guest: 'Eleanor Vance', dates: 'Oct 24 - Oct 28', room: 'Royal Suite', status: 'Confirmed', color: '#5E8B7E' },
    { id: '#ZNTH8431', guest: 'Marcus Holloway', dates: 'Nov 01 - Nov 05', room: 'Deluxe King', status: 'Pending', color: '#E2B872' },
    { id: '#ZNTH8430', guest: 'Clara Oswald', dates: 'Oct 22 - Oct 25', room: 'Junior Suite', status: 'Cancelled', color: '#D7857B' },
    { id: '#ZNTH8429', guest: 'Arthur Pendragon', dates: 'Nov 10 - Nov 15', room: 'Presidential Suite', status: 'Confirmed', color: '#5E8B7E' },
  ];

  const devices = [
    { name: 'LobbyBot 01', status: 'Online', battery: 98, color: '#5E8B7E' },
    { name: 'Floor 3 Cleaner', status: 'Online', battery: 65, color: '#E2B872' },
    { name: 'Room Service Bot 04', status: 'Maintenance', battery: 15, color: '#D7857B' },
    { name: 'PoolBot 02', status: 'Offline', battery: 0, color: '#D7857B' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <svg className="h-6 w-6 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L1 9l4 2.18v6.32L1 20v2h22v-2l-4-2.5V11.18L23 9 12 2zm-2 15.58V13.5l-4-2.18v3.5L6 15l4 2.58zm6 0L12 20l-4-2.58L12 15l4-2.76v3.5L16 13.5v4.08zM12 4.47L19.07 9 12 12.53 4.93 9 12 4.47z"></path>
          </svg>
          <h2 className="font-serif text-xl font-bold tracking-wide text-gray-900 dark:text-white">Zenith Suites</h2>
        </div>
        <Link to="/admin/login" className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-bold tracking-wider text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Manage reservations and track devices in real-time.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Reservation Panel */}
            <div className="lg:col-span-2">
              <section>
                <h2 className="font-serif text-3xl font-bold mb-6 text-gray-900 dark:text-white">Reservation Panel</h2>
                
                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                  <div className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <p className="font-medium text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">12</p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <p className="font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">84</p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                    <p className="font-medium text-gray-600 dark:text-gray-400">Cancelled</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">5</p>
                  </div>
                </div>

                {/* Search */}
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex-1 relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 pl-10 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-black focus:ring-black dark:focus:border-white dark:focus:ring-white"
                      placeholder="Search by guest name, booking ID..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    <span>Filter</span>
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Booking ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Guest Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Dates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {reservations.map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{reservation.id}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{reservation.guest}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{reservation.dates}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">{reservation.room}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: reservation.color }}>
                              {reservation.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Robot Tracker */}
            <div className="lg:col-span-1">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Robot Tracker</h2>
                  <Link to="/admin/robots-location" className="text-sm text-black dark:text-white hover:underline">
                    View Map
                  </Link>
                </div>

                {/* Device Stats */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: '#5E8B7E20', color: '#5E8B7E' }}>
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-400">Online</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: '#D7857B20', color: '#D7857B' }}>
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-400">Offline</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: '#E2B87220', color: '#E2B872' }}>
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600 dark:text-gray-400">Maintenance</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
                    </div>
                  </div>
                </div>

                {/* Device List */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Device List</h3>
                  <div className="space-y-4">
                    {devices.map((device, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{device.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{device.status}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: device.color }}>
                            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 002 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                          </svg>
                          <span>{device.battery > 0 ? `${device.battery}%` : '--%'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
