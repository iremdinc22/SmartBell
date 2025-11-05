import React from "react";

const Rules = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-16 max-w-5xl">
        <h1 
          className="text-5xl md:text-6xl font-bold text-center mb-6 text-black"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Hotel Policies
        </h1>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto text-lg">
          Please review our hotel policies to ensure a comfortable and enjoyable stay at Zenith Suites.
        </p>

        <div className="space-y-12">
          {[
            {
              title: "Check-in and Check-out",
              text: "Check-in time is 3:00 PM. Check-out time is 12:00 PM. Early check-in and late check-out are subject to availability and may incur additional charges. Please contact the front desk to arrange.",
            },
            {
              title: "Payment and Cancellation",
              text: "A valid credit card is required to guarantee your reservation. The hotel accepts major credit cards. Cancellation policies vary depending on the rate and booking period. Please refer to your booking confirmation for specific details. For non-refundable rates, the full amount of the stay will be charged at the time of booking.",
            },
            {
              title: "Smoking Policy",
              text: "Zenith Suites is a non-smoking property. Smoking is strictly prohibited in all guest rooms, public areas, and enclosed spaces. A cleaning fee will be charged for smoking in non-designated areas.",
            },
            {
              title: "Pet Policy",
              text: "Pets are not allowed at Zenith Suites, with the exception of service animals. Please notify the hotel in advance if you will be traveling with a service animal.",
            },
            {
              title: "Accessibility",
              text: "Zenith Suites is committed to providing accessible accommodations and facilities for all guests. Accessible rooms are available upon request. Please contact the hotel directly to discuss your specific needs.",
            },
            {
              title: "Children and Extra Beds",
              text: "Children of all ages are welcome. Extra beds or cribs are available upon request and may incur additional charges. Please inform the hotel of your requirements at the time of booking.",
            },
            {
              title: "Parking",
              text: "Valet parking is available at the hotel for a fee. Self-parking is not available on-site. Please inquire with the front desk for current parking rates.",
            },
            {
              title: "Liability",
              text: "Zenith Suites is not responsible for any loss or damage to personal belongings left in guest rooms or public areas. Guests are encouraged to use the in-room safe for valuables.",
            },
            {
              title: "Amendments",
              text: "The hotel reserves the right to amend these policies at any time without prior notice. Please check the hotel website or contact the front desk for the most up-to-date information.",
            },
          ].map((policy, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {policy.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{policy.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rules;
