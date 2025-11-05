import { useState } from 'react';
import Feedback from './Feedback';

const Checkout = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [faceVerified, setFaceVerified] = useState(false);
  const [keyReturned, setKeyReturned] = useState(false);
  const [wantsFeedback, setWantsFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex w-full items-center justify-center border-b border-gray-200 dark:border-gray-700 px-10 py-5">
        <div className="flex items-center gap-4">
          <svg className="h-6 w-6 text-black dark:text-white" fill="none" viewBox="0 0 48 48">
            <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
            <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764Z" fill="currentColor" fillRule="evenodd"></path>
          </svg>
          <h2 className="font-serif text-2xl font-bold tracking-wider text-black dark:text-white">Zenith Suites</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-12">
          {/* Title */}
          <div className="flex flex-col gap-3 text-center">
            <p className="font-serif text-4xl font-bold leading-tight tracking-wide text-black dark:text-white">
              Zenith Suites – Quick Check-out
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Thank you for staying at Zenith Suites! Please follow the steps below to complete your check-out process using our smart robotic system.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {/* Step 1: Room Verification */}
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
              <h2 className="font-serif text-[22px] font-bold text-black dark:text-white">1. Room Verification</h2>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                <label className="flex flex-col w-full flex-1">
                  <p className="pb-2 text-base font-medium text-black dark:text-white">Your Room Number:</p>
                  <input
                    className="h-14 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-[15px] text-base text-black dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-0 focus:ring-0"
                    placeholder="Enter your room number"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                  />
                </label>
                <button 
                  onClick={() => setFaceVerified(true)}
                  className="flex h-14 min-w-[84px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-5 text-white dark:bg-white dark:text-black sm:w-auto hover:opacity-90"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-base font-bold">Scan</span>
                </button>
              </div>
            </div>

            {/* Step 2: Identity & Key Return */}
            {faceVerified && (
              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
                <h2 className="font-serif text-[22px] font-bold text-black dark:text-white">2. Identity & Key Return</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-800 dark:text-green-300">
                      <strong>Face Recognition Status:</strong> Success. Identity verified. Thank you!
                    </p>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex-shrink-0">
                      <svg className="h-16 w-16 text-black dark:text-white" fill="none" viewBox="0 0 64 64">
                        <path d="M10 24H54C55.1046 24 56 24.8954 56 26V38C56 39.1046 55.1046 40 54 40H10C8.89543 40 8 39.1046 8 38V26C8 24.8954 8.89543 24 10 24Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        <path d="M40 32H46" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        <path d="M28 24V21.3333C28 20.4493 28.3512 19.6014 28.9763 18.9763C29.6014 18.3512 30.4493 18 31.3333 18H32.6667C33.5507 18 34.3986 18.3512 35.0237 18.9763C35.6488 19.6014 36 20.4493 36 21.3333V24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-black dark:text-white">Please place your room key in the tray below.</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Our robotic system will securely collect it.</p>
                      <button
                        onClick={() => setKeyReturned(true)}
                        className="mt-3 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90"
                      >
                        Key Placed
                      </button>
                    </div>
                  </div>

                  {keyReturned && (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                      <svg className="h-6 w-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <p className="text-black dark:text-white">Key received successfully. Your check-out is almost complete.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Final Step */}
            {keyReturned && !showFeedback && (
              <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
                <div className="flex flex-col gap-2">
                  <h2 className="font-serif text-[22px] font-bold text-black dark:text-white">3. Final Step</h2>
                  <p className="text-base text-gray-600 dark:text-gray-400">Would you like to leave feedback about your stay?</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => {
                      setWantsFeedback(true);
                      setShowFeedback(true);
                    }}
                    className="flex h-12 min-w-[84px] flex-1 items-center justify-center gap-2 rounded-lg bg-black px-5 text-white dark:bg-white dark:text-black hover:opacity-90"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-base font-bold">Yes</span>
                  </button>
                  <button
                    onClick={() => setWantsFeedback(false)}
                    className="flex h-12 min-w-[84px] flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-5 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    <span className="text-base font-bold">No</span>
                  </button>
                </div>
                {wantsFeedback === false && (
                  <div className="rounded-lg border border-transparent bg-gray-50 dark:bg-gray-700 p-4 text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      Thank you for staying with Zenith Suites. We hope to welcome you again!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Form */}
            {showFeedback && (
              <Feedback onSubmit={(data) => {
                console.log('Feedback submitted:', data);
              }} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
