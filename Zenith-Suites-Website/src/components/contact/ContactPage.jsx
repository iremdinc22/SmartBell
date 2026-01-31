import { useState } from "react";
import { createInquiry } from "@/services/inquiries";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);

    try {
      await createInquiry(formData);
      alert("Thank you for your inquiry! We will get back to you soon.");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("createInquiry error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex-1 px-10 md:px-20 lg:px-40 py-12 md:py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Information */}
        <div className="space-y-8">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-black">
            Contact Us
          </h1>
          <p className="text-base text-gray-700 max-w-lg">
            For any inquiries or assistance, please reach out to us using the
            contact information below or fill out the form. We are here to help
            make your stay at Zenith Suites exceptional.
          </p>

          {/* Location */}
          <div className="space-y-6 pt-4">
            <h2 className="font-serif text-3xl font-semibold text-black">
              Location
            </h2>

            <div className="w-full aspect-video rounded-lg shadow-md overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3002.8426437951243!2d29.6091719!3d41.1815992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x409e33d46bccf52f%3A0xe95bf1f9d74e9e50!2s%C5%9Eile%20kalesi!5e0!3m2!1str!2str!4v1769888789407!5m2!1str!2str"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title="Zenith Suites Location"
              />
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 md:p-12 rounded-lg shadow-lg">
          <h2 className="font-serif text-3xl font-semibold text-black mb-8">
            Inquiry Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="name"
              >
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
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email"
              >
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
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="subject"
              >
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
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                className="block w-full rounded-md border-gray-300 bg-white text-black placeholder-gray-400 focus:border-black focus:ring focus:ring-black focus:ring-opacity-50 transition"
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



