import { useState, useRef, useEffect } from "react";
import { verifyFace } from "@/services/faceVerif"; // backend ile iletişim için

const Checkin = () => {
  const [step, setStep] = useState(1);
  const [bookingCode, setBookingCode] = useState("");
  const [file, setFile] = useState(null);
  const [faceRecognitionStatus, setFaceRecognitionStatus] = useState(null);
  const [needsAssistance, setNeedsAssistance] = useState(null);
  const [verifyError, setVerifyError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Step 2 açıldığında kamerayı başlat
  useEffect(() => {
    if (step !== 2) return;

    let stream;

    async function initCamera() {
      console.log("initCamera called");
      setCameraError("");
      setIsCameraReady(false);

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("Camera stream obtained:", stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Bazı tarayıcılarda autoplay için play() çağrısı gerekebilir
          try {
            await videoRef.current.play();
            console.log("Video playing");
          } catch (err) {
            console.error("video.play error:", err);
          }
        } else {
          console.warn("videoRef.current is null");
        }

        setIsCameraReady(true);
      } catch (err) {
        console.error("Camera error:", err);
        setCameraError(
          "Unable to access your camera. Please check browser permissions."
        );
        setIsCameraReady(false);
      }
    }

    initCamera();

    // Step 2'den çıkarken veya component unmount olurken kamerayı kapat
    return () => {
      console.log("Cleaning up camera stream");
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [step]);

  const handleCapture = () => {
    setFaceRecognitionStatus(null);
    setCameraError("");

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.warn("Video or canvas ref is null");
      return;
    }

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    if (!video.videoWidth || !video.videoHeight) {
      console.warn("Video dimensions are 0, cannot capture yet.");
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("Failed to capture image from camera.");
          return;
        }

        const imageFile = new File([blob], "live_capture.jpg", {
          type: "image/jpeg",
        });

        console.log("Captured file from camera:", imageFile);
        setFile(imageFile);
      },
      "image/jpeg",
      0.95
    );
  };

  const handleVerify = async () => {
    if (!bookingCode || !file) {
      setVerifyError("Please enter your booking code and capture a photo.");
      return;
    }

    setVerifyError(""); 
    setFaceRecognitionStatus("processing");

    try {
        const result = await verifyFace(bookingCode.trim().toUpperCase(), file);
        setFaceRecognitionStatus("success");
      } catch (err) {
        setFaceRecognitionStatus("failed");

        // 1. Backend'den gelen veriyi al
        let rawData = err.response?.data;
        let message = "";

        // 2. Veri tipini kontrol et ve içindeki metni cımbızla çek
        if (typeof rawData === "object" && rawData !== null) {
          // Eğer { "error": "...", "message": "..." } gibi bir objeyse metni al
          message = rawData.message || rawData.error || JSON.stringify(rawData);
        } else if (typeof rawData === "string") {
          message = rawData;
        } else {
          message = err.message || "An unexpected error occurred.";
        }

        // 3. Mesajın içindeki "error:" veya "Reservation not found..." kalıntılarını temizle
        // Regex kullanarak "error:" kelimesini (büyük/küçük harf duyarsız) ve tırnakları siliyoruz
        const cleanMessage = message
          .toString()
          .replace(/^error:\s*/i, "") // En baştaki "error:" yazısını siler
          .replace(/[{}"]/g, "")      // Parantez ve tırnakları siler
          .trim();

        setVerifyError(cleanMessage);
      }
  };



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
              Welcome to Zenith Suites! Please follow the steps below to
              collect your room key. Complete the process instantly with our
              robotic check-in system.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-10">
            {/* Step 1: Booking Information */}
            {step === 1 && (
              <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-6 justify-between items-center">
                    <p className="text-black dark:text-white text-base font-medium">
                      Step 1 of 3: Booking Information
                    </p>
                  </div>
                  <div className="rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded bg-black dark:bg-white"
                      style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex w-full max-w-[480px] flex-wrap items-end gap-4 mx-auto">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-black dark:text-white text-base font-medium pb-2">
                      Your Booking Code
                    </p>
                    <input
                      className="form-input flex w-full resize-none overflow-hidden rounded-lg text-black dark:text-white focus:outline-0 focus:ring-0 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-black dark:focus:border-white h-14 placeholder:text-gray-500 p-[15px] text-base"
                      placeholder="Please enter your Booking Code to begin."
                      value={bookingCode}
                      onChange={(e) => setBookingCode(e.target.value)}
                    />
                  </label>
                </div>

                <div className="flex px-4 py-3 justify-center">
                  <button
                    onClick={() => setStep(2)}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-black text-white dark:bg-white dark:text-black gap-2 pl-5 text-base font-bold"
                  >
                    <span>Next</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Face Recognition */}
            {step === 2 && (
              <div className="flex flex-col gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-black dark:text-white text-lg font-bold text-center font-serif">
                  Face Recognition and Room Key
                </h3>

                <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-4">
                    Please position your face in front of the camera, capture a
                    photo, and then start verification.
                  </p>

                  {/* Video (canlı kamera görüntüsü) */}
                  <div className="flex flex-col items-center gap-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full max-w-md aspect-video bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 object-cover shadow-sm"
                    />

                    {/* Yakalanan fotoğrafın çizileceği canvas */}
                    <canvas
                      ref={canvasRef}
                      className={`w-full max-w-md aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-600 object-cover shadow-sm ${!file ? 'hidden' : 'block'}`}
                    />

                    <button
                      type="button"
                      onClick={handleCapture}
                      disabled={!isCameraReady}
                      className="mt-2 bg-gray-700 text-white dark:bg-white dark:text-black px-6 py-2 rounded-lg font-bold disabled:opacity-60"
                    >
                      {isCameraReady ? "Capture Photo" : "Camera Loading..."}
                    </button>

                    {file && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Photo captured. You can now proceed with verification.
                      </p>
                    )}

                    {cameraError && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                        {cameraError}
                      </p>
                    )}

                    <button
                      onClick={handleVerify}
                      className="mt-4 bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-lg font-bold"
                    >
                      Verify
                    </button>
                  </div>

                  {faceRecognitionStatus === "success" && (
                    <>
                      <p className="text-green-700 dark:text-green-300 font-semibold mt-4">
                        Verification Successful! You can proceed to Step 3.
                      </p>
                      <button
                        onClick={() => setStep(3)}
                        className="mt-4 bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-lg font-bold"
                      >
                        Continue
                      </button>
                    </>
                  )}

                  {faceRecognitionStatus === "failed" && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-700 dark:text-red-400 font-semibold text-center">
                        Check-in Failed
                      </p>
                      <p className="text-red-600 dark:text-red-300 text-sm text-center mt-1">
                        {verifyError}
                      </p>
                      <button 
                        onClick={() => {
                          setFaceRecognitionStatus(null); // Durumu sıfırla
                          setVerifyError("");            // Hata metnini temizle
                          setFile(null);                 // Önceki fotoğraf dosyasını sil
                          // İsteğe bağlı: Canvas'ın içeriğini de temizlemek için:
                          const canvas = canvasRef.current;
                          if(canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                        }} 
                        className="mt-3 bg-red-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition-colors block mx-auto"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Additional Services */}
            {step === 3 && (
              <div className="flex flex-col gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-black dark:text-white text-lg font-bold text-center font-serif">
                  Additional Service Request
                </h3>

                <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    Would you like our robot to carry your belongings or escort
                    you to your room?
                  </p>

                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                      onClick={() => setNeedsAssistance(true)}
                      className="flex min-w-[84px] max-w-[200px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-black text-white dark:bg-white dark:text-black gap-2 text-base font-bold"
                    >
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
                      Excellent! Our robotic bellboy is on his way. Enjoy your
                      stay!
                    </p>
                  </div>
                )}

                {needsAssistance === false && (
                  <div className="w-full bg-gray-100 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-800 dark:text-gray-200 text-center text-base leading-relaxed">
                      Thank you for your choice. Your room is waiting for you!
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
