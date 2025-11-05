import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-white antialiased">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-5xl">
        <section className="text-center mb-16">
          <h1 
            className="text-5xl md:text-7xl font-bold text-black mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Zenith Suites: A New Era of Future Hospitality
          </h1>
          <div className="prose prose-lg mx-auto text-gray-800 space-y-6">
            <p className="text-lg leading-relaxed">
              Founded in 2025 in Istanbul, Zenith Suites brought an innovative breath
              to the hospitality industry with the visionary approach of its founders
              Atahan Doruk Yılmaz, Elif Deniz Gölboyu, Emre Harmandal, İrem Dinç,
              and Rana Kara. Blending human-centered service with artificial
              intelligence and robotic technologies, Zenith Suites offers a boutique
              experience that combines luxury and efficiency.
            </p>
            <p className="text-lg leading-relaxed">
              Zenith Suites' services are supported by a "Nexus" team of robotic
              advisors, bellboys, and servers. This automation allows human staff to
              interact with guests in a more personal and in-depth way, increasing
              guest satisfaction.
            </p>
            <p className="text-lg leading-relaxed">
              The hotel has a modern and fully equipped gym, a relaxing spa, swimming
              pool, bar, and restaurant. These facilities are designed to provide
              guests with physical and mental relaxation during their stay. Our hotel
              is located 5 minutes away from Uzunkum beach and guests can benefit from
              our facilities on the beach free of charge.
            </p>
            <p className="text-lg leading-relaxed">
              With a capacity of 50 guests, Zenith Suites aims to provide a
              personalized accommodation experience by giving each guest special
              attention and care. Zenith Suites is a pioneering hotel that sets the
              hospitality standards of the future with the perfect combination of
              technology and hospitality.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To redefine luxury hospitality by seamlessly integrating cutting-edge technology 
              with personalized human touch, creating unforgettable experiences for every guest.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our Vision
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To be the world's leading boutique hotel brand that sets new standards 
              in hospitality innovation, sustainability, and guest satisfaction.
            </p>
          </div>
        </section>

        {/* Founders */}
        <section className="text-center">
          <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Meet Our Founders
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              "Atahan Doruk Yılmaz",
              "Elif Deniz Gölboyu",
              "Emre Harmandal",
              "İrem Dinç",
              "Rana Kara"
            ].map((name, idx) => (
              <div key={idx} className="text-center">
                <div className="w-24 h-24 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-gray-500">Co-Founder</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
