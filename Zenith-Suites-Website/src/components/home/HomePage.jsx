import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600')"
          }}
        />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 
            className="text-6xl md:text-8xl font-bold mb-6 tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Zenith Suites
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience unparalleled luxury and impeccable service in the heart of Şile, Istanbul
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/booking"
              className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-200 transition-colors rounded-md"
            >
              Book Your Stay
            </Link>
            <Link
              to="/rooms"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black transition-colors rounded-md"
            >
              Explore Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Why Choose Zenith Suites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-white rounded-full">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Luxury Rooms</h3>
              <p className="text-gray-400">
                Elegantly designed suites with private jacuzzis, infinity pools, and breathtaking views
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-white rounded-full">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Service</h3>
              <p className="text-gray-400">
                Experience the future with our robotic concierge and smart room systems
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-white rounded-full">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium Amenities</h3>
              <p className="text-gray-400">
                Spa, fitness center, fine dining, private beach access, and more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Room Preview Section */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Our Suites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="relative h-80 overflow-hidden rounded-lg group">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800')"
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold mb-2">Type A - 2-Person Suites</h3>
                <p className="text-gray-300">Intimate luxury for couples</p>
              </div>
            </div>

            <div className="relative h-80 overflow-hidden rounded-lg group">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800')"
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold mb-2">Type C - Family Suites</h3>
                <p className="text-gray-300">Spacious comfort for families</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              to="/rooms"
              className="inline-block bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-200 transition-colors rounded-md"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Prime Location in Şile
              </h2>
              <p className="text-gray-400 mb-6 text-lg">
                Located just 5 minutes from Uzunkum Beach, Zenith Suites offers the perfect blend of coastal serenity and modern luxury.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h4 className="font-bold mb-1">Address</h4>
                    <p className="text-gray-400">Balibey, Halay Sk. No:5, 34980 Sile/Istanbul</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg className="w-6 h-6 text-white flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <h4 className="font-bold mb-1">Phone</h4>
                    <p className="text-gray-400">+90 (216) 712 34 56</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-96 bg-gray-800 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.8123456789!2d29.6123456!3d41.1123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA2JzQ0LjQiTiAyOcKwMzYnNDQuNCJF!5e0!3m2!1sen!2str!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zenith Suites Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Ready to Experience Luxury?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Book your stay today and discover the perfect blend of technology and hospitality
          </p>
          <Link
            to="/booking"
            className="inline-block bg-white text-black px-12 py-5 text-lg font-semibold hover:bg-gray-200 transition-colors rounded-md"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
