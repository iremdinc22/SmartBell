import { useState } from 'react';

const Checkin = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [step, setStep] = useState(1);
  const [faceRecognitionStatus, setFaceRecognitionStatus] = useState('success'); // 'success' or 'failed'
  const [needsAssistance, setNeedsAssistance] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-10 sm:py-20">
        <div className="max-w-[960px] mx-auto flex flex-col gap-12">
          {/* Page Heading */}
          <div className="text-center">
            <h1 className="text-black dark:text-white text-4xl sm:text-5xl font-bold leading-tight tracking-tight font-serif mb-4">
              Zenith Suites - Quick Check-in
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-normal max-w-2xl mx-auto">
              Welcome to Zenith Suites! Please follow the steps below to collect your room key. 
              Complete the process instantly with our robotic check-in system.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-10">
            {/* Step 1: Room Information */}
            <div className="flex flex-col gap-6 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex gap-6 justify-between items-center">
                  <p className="text-black dark:text-white text-base font-medium">Step 1 of 3: Room Information</p>
                </div>
                <div className="rounded bg-gray-200 dark:bg-gray-700">
                  <div className="h-2 rounded bg-black dark:bg-white" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>
              </div>
              
              <div className="flex w-full max-w-[480px] flex-wrap items-end gap-4 mx-auto">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-black dark:text-white text-base font-medium pb-2">Your Room Number</p>
                  <input
                    className="form-input flex w-full resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-0 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black dark:focus:border-white h-14 placeholder:text-gray-500 p-[15px] text-base"
                    placeholder="Please enter your Room Number to begin."
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                  />
                </label>
              </div>
              
              <div className="flex px-4 py-3 justify-center">
                <button
                  onClick={() => setStep(2)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-black text-white dark:bg-white dark:text-black gap-2 pl-5 text-base font-bold"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Scan</span>
                </button>
              </div>
            </div>

            {/* Step 2: Face Recognition */}
            {step >= 2 && (
              <div className="flex flex-col gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-black dark:text-white text-lg font-bold text-center font-serif">
                  Face Recognition and Room Key
                </h3>
                
                <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                    Please turn your face towards our robot advisor. Your identity is being scanned and verified...
                  </p>
                  <p className="text-black dark:text-white text-base font-semibold leading-relaxed mt-4">
                    Face Recognition Status:{' '}
                    <span className={faceRecognitionStatus === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {faceRecognitionStatus === 'success' ? 'Success' : 'Failed'}
                    </span>
                  </p>
                </div>

                {faceRecognitionStatus === 'success' ? (
                  <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-1/3 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-green-700 dark:text-green-300 font-semibold mb-2">Verification Successful</p>
                      <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                        Your identity has been successfully verified. Our robot is now handing you your key. Please collect it.
                      </p>
                      <button
                        onClick={() => setStep(3)}
                        className="mt-4 bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-lg font-bold hover:opacity-90"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800/50">
                    <p className="text-red-700 dark:text-red-300 font-semibold mb-2">Verification Failed</p>
                    <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                      Your identity could not be verified. Please contact the front desk for assistance.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Additional Services */}
            {step >= 3 && (
              <div className="flex flex-col gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-black dark:text-white text-lg font-bold text-center font-serif">
                  Additional Service Request
                </h3>
                
                <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    A small question for the first step of your stay: <br />
                    Would you like me to carry your belongings to your room and/or take you to your room?
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                      onClick={() => setNeedsAssistance(true)}
                      className="flex min-w-[84px] max-w-[200px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-black text-white dark:bg-white dark:text-black gap-2 text-base font-bold"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <span>Yes</span>
                    </button>
                    <button
                      onClick={() => setNeedsAssistance(false)}
                      className="flex min-w-[84px] max-w-[200px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-transparent text-black dark:text-white border border-black dark:border-white gap-2 text-base font-bold"
                    >
                      <span>No</span>
                    </button>
                  </div>
                </div>

                {needsAssistance === true && (
                  <div className="w-full bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800/50">
                    <p className="text-green-800 dark:text-green-200 text-center text-base leading-relaxed">
                      Excellent! Our robotic bellboy is on his way to pick up your belongings and escort you. We wish you a pleasant stay!
                    </p>
                  </div>
                )}

                {needsAssistance === false && (
                  <div className="w-full bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-800 dark:text-gray-200 text-center text-base leading-relaxed">
                      Thank you for your choice. Your room is waiting for you! We wish you a pleasant stay!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkin;
