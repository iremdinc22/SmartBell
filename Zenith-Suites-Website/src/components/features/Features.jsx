import React from "react";

const ZenithSuitesFeatures = () => {
  const inRoomFeatures = [
    {
      title: "General Amenities",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      items: [
        "Smart Climate Control: Individually adjustable heating and air conditioning",
        "High-Speed Wi-Fi & Ethernet Connectivity: Complimentary internet access",
        "Interactive Smart TV: Large-screen with streaming services",
        "Integrated Sound System: Premium audio for personalized ambiance",
        "Luxury Linens & Hypoallergenic Pillows: High-quality bedding",
        "Plush Bathrobes & Slippers: Ultimate comfort",
        "Electronic Safe: Secure storage sized for laptops",
        "Iron & Ironing Board: For your convenience",
        "Complimentary Bottled Water: Replenished daily",
        "Daily Housekeeping Service: Automated and manual cleaning",
      ],
    },
    {
      title: "Kitchenette / Refreshment Area",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      items: [
        "Fully Stocked Minibar: Premium beverages and snacks",
        "Nespresso Coffee Machine & Tea Selection: Perfect start to your day",
        "Complimentary Coffee & Tea Capsules: Range of exquisite flavors",
      ],
    },
    {
      title: "Bathroom & Wellness",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      items: [
        "Designer Bathroom Amenities: Premium toiletries",
        "Rain Shower & Deep Soaking Tub (select suites): Ultimate relaxation",
        "Heated Towel Racks: Added comfort",
        "Hair Dryer: High-quality and easy to use",
        "Illuminated Vanity Mirror: Perfect for grooming",
      ],
    },
    {
      title: "Technology & Smart Features",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      items: [
        "Voice-Activated Room Controls: Hands-free adjustment",
        "Smart Lighting Scenes: Pre-set moods (Relax, Work, Sleep)",
        "Automated Blackout Curtains: Complete privacy",
        "USB Charging Ports: Conveniently located throughout",
        "Digital Do Not Disturb/Make Up Room Signage",
        "Direct Access to Robot Concierge Services",
      ],
    },
    {
      title: "Outdoor Amenities",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      items: [
        "Private Veranda: Lovely patio for outdoor relaxation",
        "In-Suite Jacuzzi (select rooms): Luxurious bathing experience",
        "In-Suite Infinity Pool (exclusive suites): Beach views, unparalleled swimming",
      ],
    },
  ];

  const commonAreaFeatures = [
    {
      title: "The Fitness Center",
      description:
        "State-of-the-art equipment with virtual AI trainers and on-site human fitness experts. An inspiring environment for your wellness journey.",
      icon: "💪"
    },
    {
      title: "The Spa & Wellness Sanctuary",
      description:
        "Serene oasis offering rejuvenating massages, facials, hair therapy, hydrotherapy pools, steam rooms, Turkish hammam, and saunas.",
      icon: "🧖"
    },
    {
      title: "In-Suite Dining",
      description:
        "24/7 service featuring gourmet dishes from local delicacies to international favorites. Orders placed via website, delivered by robot servers.",
      icon: "🍽️"
    },
    {
      title: "The Zenith Brew & Bar",
      description:
        "Stylish space transitioning from daytime cafe to elegant evening lounge. Expertly crafted coffees, fine teas, premium spirits, and signature cocktails.",
      icon: "🍸"
    },
    {
      title: "The Equinox Restaurant",
      description:
        "Signature restaurant harmonizing modern culinary techniques with Turkish and international cuisines. Breathtaking views and extensive wine list.",
      icon: "🌟"
    },
    {
      title: "The Center Pool",
      description:
        "Magnificent pool at the hotel front with beach views. Surrounded by loungers and cabanas with poolside robot server service.",
      icon: "🏊"
    },
    {
      title: "The Grand Tennis Court",
      description:
        "Pristine court with professional-grade surfacing. Perfect for casual rallies and competitive matches. Equipment available for guests.",
      icon: "🎾"
    },
    {
      title: "The Enjoyment Mini Golf",
      description:
        "Beautifully landscaped course perfect for all ages. Clubs and balls provided for immediate play.",
      icon: "⛳"
    },
    {
      title: "Azure Sands Private Beach",
      description:
        "Pristine private beach with exclusive seaside experience. Dedicated beach service with sunbeds, umbrellas, and refreshments.",
      icon: "🏖️"
    },
    {
      title: "Valet Service",
      description:
        "Professional valet ensuring seamless parking experience. Secure vehicle storage with effortless retrieval.",
      icon: "🚗"
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        <h1 
          className="text-5xl md:text-6xl font-bold text-center mb-4 text-black"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Zenith Suites Features
        </h1>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-lg">
          Experience unparalleled luxury with our comprehensive suite of amenities and services designed for your ultimate comfort.
        </p>

        {/* In-Room Features */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            In-Room Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inRoomFeatures.map((section, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-black">{section.icon}</div>
                  <h3 className="text-xl font-bold">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-black mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Common Area Features */}
        <section>
          <h2 className="text-4xl font-bold mb-12 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Common Area Features & Services
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {commonAreaFeatures.map((area, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border border-gray-200 hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">{area.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{area.title}</h3>
                <p className="text-gray-700 leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ZenithSuitesFeatures;
