import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission
    alert('Thank you for your inquiry! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="flex-1 px-10 md:px-20 lg:px-40 py-12 md:py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Information */}
        <div className="space-y-8">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-black">Contact Us</h1>
          <p className="text-base text-gray-700 max-w-lg">
            For any inquiries or assistance, please reach out to us using the contact information below or fill out the form. 
            We are here to help make your stay at Zenith Suites exceptional.
          </p>

          {/* Location */}
          <div className="space-y-6 pt-4">
            <h2 className="font-serif text-3xl font-semibold text-black">Location</h2>
            <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg shadow-md bg-gray-300 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-600">Interactive Map</p>
                <p className="text-sm text-gray-500">Şile, Istanbul</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 md:p-12 rounded-lg shadow-lg">
          <h2 className="font-serif text-3xl font-semibold text-black mb-8">Inquiry Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="block w-full rounded-md border-gray-300 bg-white focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 transition"
                id="name"
                name="name"
                placeholder="Enter your name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="block w-full rounded-md border-gray-300 bg-white focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 transition"
                id="email"
                name="email"
                placeholder="Enter your email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="subject">
                Subject
              </label>
              <input
                className="block w-full rounded-md border-gray-300 bg-white focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 transition"
                id="subject"
                name="subject"
                placeholder="Enter the subject"
                type="text"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className="block w-full rounded-md border-gray-300 bg-white focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 transition"
                id="message"
                name="message"
                placeholder="Enter your message"
                rows="5"
                value={formData.message}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <button
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                type="submit"
              >
                Submit Inquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;