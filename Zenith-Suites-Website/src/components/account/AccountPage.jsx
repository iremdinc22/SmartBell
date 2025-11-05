import { useState } from 'react';

const AccountPage = () => {
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'John',
    lastName: 'Appleseed',
    email: 'john.appleseed@email.com',
    phone: '+1 234 567 890'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated personal info:', personalInfo);
    // Handle form submission
  };

  return (
    <div className="px-4 md:px-10 lg:px-20 xl:px-40 py-12 flex-1 bg-gray-50/50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="font-serif text-5xl font-semibold text-black">My Account</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* Upcoming Bookings */}
            <section>
              <h3 className="font-serif text-3xl font-medium text-black border-b border-gray-200 pb-4 mb-6">
                Upcoming Bookings
              </h3>
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="mx-auto h-48 w-64 mb-6 opacity-70 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-black mb-2">No upcoming bookings</h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You don't have any upcoming bookings. Explore our rooms and suites to plan your next luxurious stay.
                </p>
                <button className="bg-gray-100 text-black hover:bg-gray-200 transition-colors font-medium py-2 px-6 rounded-md">
                  Explore Rooms &amp; Suites
                </button>
              </div>
            </section>

            {/* Past Bookings */}
            <section>
              <h3 className="font-serif text-3xl font-medium text-black border-b border-gray-200 pb-4 mb-6">
                Past Bookings
              </h3>
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="mx-auto h-48 w-64 mb-6 opacity-70 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-black mb-2">No past bookings</h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Once you've stayed with us, your booking history will appear here, ready for you to revisit your favorite moments.
                </p>
              </div>
            </section>

            {/* Payment Methods */}
            <section>
              <h3 className="font-serif text-3xl font-medium text-black border-b border-gray-200 pb-4 mb-6">
                Payment Methods
              </h3>
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-6" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <h4 className="text-xl font-semibold text-black mb-2">No payment methods added</h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Add a payment method to make future bookings faster and more convenient.
                </p>
                <button className="bg-gray-100 text-black hover:bg-gray-200 transition-colors font-medium py-2 px-6 rounded-md">
                  Add Payment Method
                </button>
              </div>
            </section>
          </div>

          {/* Personal Information Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-sm sticky top-12">
              <h3 className="font-serif text-3xl font-medium text-black border-b border-gray-200 pb-4 mb-6">
                Personal Information
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 transition"
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={personalInfo.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 transition"
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={personalInfo.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 transition"
                    id="email"
                    name="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 transition"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="pt-4">
                  <button
                    className="bg-black text-white hover:bg-opacity-90 transition-colors w-full font-bold py-3 px-4 rounded-md"
                    type="submit"
                  >
                    Update Information
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;