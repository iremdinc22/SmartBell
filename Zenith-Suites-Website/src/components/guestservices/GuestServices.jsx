import { Link } from 'react-router-dom';

const GuestServices = () => {
  const services = [
    { name: 'Check-in', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', link: '/guest-services/checkin' },
    { name: 'Check-out', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', link: '/guest-services/checkout' },
    { name: 'Help', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', link: '/contact' },
    { name: 'Housekeeping', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', link: '/contact' },
    { name: 'Concierge', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', link: '/contact' },
    { name: 'Transportation', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2', link: '/contact' },
    { name: 'In-Room Dining', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', link: '/contact' },
    { name: 'Lost & Found', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', link: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-10 py-4">
        <div className="flex items-center gap-3">
          <svg className="text-black h-7 w-7" fill="none" viewBox="0 0 24 24">
            <path d="M12 2L1 9V21H8V14H16V21H23V9L12 2ZM11 19H5V10.18L12 4.48L19 10.18V19H13V12H11V19Z" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5"></path>
          </svg>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-black">Zenith Suites</h1>
        </div>
        <nav className="hidden lg:flex items-center gap-8 text-black">
          <Link className="text-sm font-medium hover:text-gray-600 transition-colors" to="/rooms">Rooms & Suites</Link>
          <Link className="text-sm font-medium hover:text-gray-600 transition-colors" to="/features">Amenities</Link>
          <Link className="text-sm font-medium hover:text-gray-600 transition-colors" to="/gallery">Gallery</Link>
          <Link className="text-sm font-medium hover:text-gray-600 transition-colors" to="/contact">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/booking" className="flex h-10 max-w-40 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-bold text-white transition-opacity hover:opacity-90">
            Book Now
          </Link>
          <Link to="/account" className="h-10 w-10 rounded-full border-2 border-black bg-gray-200 flex items-center justify-center">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <h2 className="font-serif text-black text-5xl font-medium text-center pb-12 tracking-tight">Guest Services</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, idx) => (
              <Link
                key={idx}
                to={service.link}
                className="group flex items-center gap-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-black hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-black transition-colors group-hover:bg-black group-hover:text-white">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                </div>
                <p className="text-lg font-medium text-black">{service.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuestServices;
