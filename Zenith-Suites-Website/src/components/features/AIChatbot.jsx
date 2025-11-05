import { useState } from 'react';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Welcome to Zenith Suites. How may I assist you today? You can ask me to 'Book a room' or 'Explore dining options'."
    },
    {
      type: 'user',
      text: "I'd like to explore dining options."
    },
    {
      type: 'bot',
      text: "Of course. We have three exceptional dining venues: The Onyx Grill for fine dining, The Ivory Lounge for cocktails and light bites, and The Garden Terrace for casual breakfast and lunch. Which would you like to know more about?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { type: 'user', text: inputValue }]);
      setInputValue('');
      setIsTyping(true);
      
      // Simulate bot response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: 'bot',
          text: "Thank you for your message. Our AI assistant is processing your request..."
        }]);
        setIsTyping(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 sm:px-10 py-4">
        <div className="flex items-center gap-4 text-black dark:text-white">
          <div className="size-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
              <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold leading-tight">Zenith Suites</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9 text-sm font-medium text-black dark:text-white">
            <a className="hover:opacity-80" href="/">Rooms & Suites</a>
            <a className="hover:opacity-80" href="/">Dining</a>
            <a className="hover:opacity-80" href="/">Spa</a>
            <a className="hover:opacity-80" href="/">Events</a>
            <a className="hover:opacity-80" href="/contact">Contact</a>
          </div>
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-black dark:bg-white text-white dark:text-black text-sm font-bold leading-normal hover:opacity-90">
            <span className="truncate">Book Now</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col flex-1 w-full items-center">
        <div className="flex flex-col w-full max-w-4xl flex-1 p-4 md:p-8">
          {/* Page Heading */}
          <div className="flex flex-col gap-3 text-center mb-8">
            <p className="font-serif text-black dark:text-white text-4xl sm:text-5xl font-normal tracking-wide">
              Zenith AI Concierge
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal max-w-2xl mx-auto">
              Your personal assistant for a seamless stay. Ask me anything about your reservation, our amenities, or local attractions.
            </p>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col flex-1 w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
            {/* Chat Window */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[500px]">
              {messages.map((message, index) => (
                message.type === 'bot' ? (
                  // Bot Message
                  <div key={index} className="flex items-end gap-3">
                    <div className="flex-shrink-0 size-8 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                      <div className="size-4 text-black dark:text-white">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                          <path d="M35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                      <p className="font-serif text-sm text-gray-600 dark:text-gray-400">Zenith Assistant</p>
                      <div className="flex max-w-md rounded-lg rounded-bl-none px-4 py-3 bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-transparent">
                        <p className="text-base font-normal leading-normal">{message.text}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // User Message
                  <div key={index} className="flex items-end gap-3 justify-end">
                    <div className="flex flex-col gap-1 items-end">
                      <p className="text-sm text-gray-600 dark:text-gray-400">You</p>
                      <div className="flex max-w-md rounded-lg rounded-br-none px-4 py-3 bg-gray-800 dark:bg-gray-600 text-white">
                        <p className="text-base font-normal leading-normal">{message.text}</p>
                      </div>
                    </div>
                  </div>
                )
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-end gap-3">
                  <div className="flex-shrink-0 size-8 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                    <div className="size-4 text-black dark:text-white">
                      <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                        <path d="M35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-start">
                    <p className="font-serif text-sm text-gray-600 dark:text-gray-400">Zenith Assistant</p>
                    <div className="flex items-center gap-1.5 rounded-lg rounded-bl-none px-4 py-3 bg-white dark:bg-gray-700 text-black dark:text-white border border-gray-200 dark:border-transparent">
                      <span className="size-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                      <span className="size-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                      <span className="size-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white/50 dark:bg-gray-800/50">
              <div className="relative">
                <input
                  className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg py-3 pl-4 pr-12 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition"
                  placeholder="Ask about reservations, amenities, or local attractions..."
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChatbot;
