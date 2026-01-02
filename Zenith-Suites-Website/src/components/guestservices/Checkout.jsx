import { useState } from "react";
import Feedback from "./Feedback";
import { checkoutWithPin } from "@/services/checkout";

const Checkout = () => {
  const [step, setStep] = useState(1);

  const [bookingCode, setBookingCode] = useState("");
  const [pin, setPin] = useState("");

  const [pinVerified, setPinVerified] = useState(false);
  const [keyReturned, setKeyReturned] = useState(false);
  
  const [wantsFeedback, setWantsFeedback] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [statusMessage, setStatusMessage] = useState("");
  const [requiresFrontDesk, setRequiresFrontDesk] = useState(false);
  const [extraChargeAmount, setExtraChargeAmount] = useState(0);

  const [loading, setLoading] = useState(false);

  const handleGoStep2 = () => {
    setStatusMessage("");
    setRequiresFrontDesk(false);
    setExtraChargeAmount(0);

    if (!bookingCode.trim()) {
      setStatusMessage("Please enter your Booking Code.");
      return;
    }
    setStep(2);
  };

  const handleVerifyPin = async () => {
    setStatusMessage("");
    setRequiresFrontDesk(false);
    setExtraChargeAmount(0);

    if (!bookingCode.trim() || !pin.trim()) {
      setStatusMessage("Please enter Booking Code and Room PIN.");
      return;
    }

    try {
      setLoading(true);

      const res = await checkoutWithPin(bookingCode, pin);
      // res örneği (senin DTO):
      // {
      //   bookingCode,
      //   checkedOutAtUtc,
      //   requiresFrontDesk,
      //   extraChargeAmount,
      //   message
      // }

      if (res?.requiresFrontDesk) {
        setRequiresFrontDesk(true);
        setExtraChargeAmount(res.extraChargeAmount ?? 0);
        setStatusMessage(res.message || "Extra payment required. Please proceed to the front desk.");
        // bu senaryoda ilerletmiyoruz
        setPinVerified(false);
        return;
      }

      setPinVerified(true);
      setStatusMessage(res?.message || "PIN verified. You can continue.");
      setStep(3);
    } catch (err) {
      console.error("Checkout verify failed:", err);

      // api.js hata objesini string JSON olarak döndürüyor olabilir:
      // Error: {"error":"Invalid PIN."}
      const msg =
        typeof err?.message === "string"
          ? err.message
          : "Verification failed. Please check your PIN.";

      setStatusMessage(msg);
      setPinVerified(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex w-full items-center justify-center border-b border-gray-200 dark:border-gray-700 px-10 py-5">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl font-bold tracking-wider text-black dark:text-white">
            Zenith Suites
          </h2>
        </div>
      </header>

      <main className="flex flex-1 justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-12">
          <div className="flex flex-col gap-3 text-center">
            <p className="font-serif text-4xl font-bold leading-tight tracking-wide text-black dark:text-white">
              Zenith Suites – Quick Check-out
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Please follow the steps below to complete your check-out process.
            </p>
          </div>

          <div className="space-y-8">
            {/* STEP 1: Booking Code */}
            {step === 1 && (
              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
                <h2 className="font-serif text-[22px] font-bold text-black dark:text-white">
                  1. Booking Verification
                </h2>

                <label className="flex flex-col w-full">
                  <p className="pb-2 text-base font-medium text-black dark:text-white">
                    Your Booking Code:
                  </p>
                  <input
                    className="h-14 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-[15px] text-base text-black dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-0 focus:ring-0"
                    placeholder="Enter your Booking Code"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                  />
                </label>

                <button
                  onClick={handleGoStep2}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold hover:opacity-90"
                >
                  Next
                </button>

                {statusMessage && (
                  <p className="text-sm mt-2 text-red-600 dark:text-red-400">
                    {statusMessage}
                  </p>
                )}
              </div>
            )}

            {/* STEP 2: PIN Verification */}
            {step === 2 && (
              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
                <h2 className="font-serif text-[22px] font-bold text-black dark:text-white">
                  2. Room PIN Verification
                </h2>

                <label className="flex flex-col w-full">
                  <p className="pb-2 text-base font-medium text-black dark:text-white">
                    Room PIN:
                  </p>
                  <input
                    className="h-14 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-[15px] text-base text-black dark:text-white placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-0 focus:ring-0"
                    placeholder="Enter the PIN you received by email"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                </label>

                <button
                  onClick={handleVerifyPin}
                  disabled={loading}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify PIN"}
                </button>

                {!!statusMessage && (
                  <div
                    className={`rounded-lg p-4 text-sm ${
                      requiresFrontDesk
                        ? "border border-yellow-400/50 bg-yellow-400/10 text-yellow-800 dark:text-yellow-200"
                        : pinVerified
                        ? "border border-green-500/50 bg-green-500/10 text-green-800 dark:text-green-200"
                        : "border border-red-500/50 bg-red-500/10 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {statusMessage}
                    {requiresFrontDesk && extraChargeAmount > 0 && (
                      <div className="mt-1 font-semibold">
                        Extra charge: {extraChargeAmount}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setStep(1)}
                  className="text-sm underline text-gray-600 dark:text-gray-300 mt-1"
                >
                  Back
                </button>
              </div>
            )}

            {/* STEP 3: Identity & Key Return (artık PIN doğrulandıktan sonra açılıyor) */}
            {step === 3 && (
              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
                <h2 className="font-serif text-[22px] font-bold text-black dark:text-white">
                  3. Key Return
                </h2>

                <div className="flex items-center gap-3 rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                  <p className="text-green-800 dark:text-green-300">
                    <strong>Status:</strong> PIN verified. You can return the key.
                  </p>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <div>
                    <p className="font-medium text-black dark:text-white">
                      Please place your room key in the tray below.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our robotic system will securely collect it.
                    </p>

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
                    <p className="text-black dark:text-white">
                      Key received successfully. Your check-out is almost complete.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Feedback */}
            {keyReturned && !showFeedback && (
              <div className="flex flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
                <div className="flex flex-col gap-2">
                  <h2 className="font-serif text-[22px] font-bold text-black dark:text-white">
                    4. Final Step
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    Would you like to leave feedback about your stay?
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => {
                      setWantsFeedback(true);
                      setShowFeedback(true);
                    }}
                    className="flex h-12 flex-1 items-center justify-center rounded-lg bg-black px-5 text-white dark:bg-white dark:text-black hover:opacity-90 font-bold"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setWantsFeedback(false)}
                    className="flex h-12 flex-1 items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-5 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 font-bold"
                  >
                    No
                  </button>
                </div>

                {wantsFeedback === false && (
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-4 text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                      Thank you for staying with Zenith Suites. We hope to welcome you again!
                    </p>
                  </div>
                )}
              </div>
            )}

            {showFeedback && (
              <Feedback
                onSubmit={(data) => {
                  console.log("Feedback submitted:", data);
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
