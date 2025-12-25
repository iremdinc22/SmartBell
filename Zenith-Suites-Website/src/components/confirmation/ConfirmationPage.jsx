import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const bookingId = state?.bookingId || '—';
  const bookingRef = state?.bookingRef || '—';
  const total = state?.total || '—';
  const currency = state?.currency || 'EUR';

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 py-16">
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-10 text-center max-w-lg w-full">
        <div className="mb-6">
          <svg
            className="mx-auto w-16 h-16 text-green-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-serif text-4xl font-bold mb-4">Booking Confirmed</h1>
        <p className="text-gray-400 mb-8">
          Thank you for choosing <span className="text-white font-semibold">Zenith Suites</span>.
          Your reservation has been successfully completed.
        </p>

        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 text-left space-y-3 mb-8">
          <div className="flex justify-between text-gray-400">
            <span>Booking Reference:</span>
            <span className="text-white font-semibold">{bookingRef}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Booking ID:</span>
            <span className="text-white">{bookingId}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Total Paid:</span>
            <span className="text-white font-semibold">
              {currency} {total}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Status:</span>
            <span className="text-green-400 font-semibold">CONFIRMED</span>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-8">
          A confirmation email with your booking details has been sent.
        </p>

        <button
          onClick={handleBack}
          className="w-full bg-white text-black py-3 px-6 rounded-md font-semibold hover:bg-gray-200 transition-colors"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
