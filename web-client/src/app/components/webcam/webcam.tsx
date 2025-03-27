import { Button } from "@mui/material";
import { useRef, useState } from "react";

const Webcam = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  const startWebcam = async () => {
    if (videoRef.current && canvasRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    }
  };

  const stopWebcam = async () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    const res = await fetch("http://localhost:5002/predict", {
      method: "POST",
      body: JSON.stringify({ image: capturedImage }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (res.ok) {
      const text = await res.text();
      const message = JSON.parse(text);
      setMessage(message.message);
    }
  };

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvasRef.current.getContext("2d");

      // Set canvas dimensions to match video stream
      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Draw video frame onto canvas
        context.drawImage(video, 0, 0);
        // Get image data URL from canvas
        setCapturedImage(canvas.toDataURL("image/png"));
      }
    }
  };

  const resetState = () => {
    stopWebcam();
    setCapturedImage(null);
  };

  return (
    <div className="webcam-container flex flex-col items-center justify-center">
      {capturedImage ? (
        <>
          <img src={capturedImage} alt="Captured" className="preview-img" />
          <Button onClick={resetState} variant="contained" color="warning">
            Reset
          </Button>
        </>
      ) : (
        <>
          <video ref={videoRef} autoPlay muted className="webcam-video" />
          <canvas ref={canvasRef} className="webcam-canvas" />
          {!videoRef.current ? (
            <Button onClick={startWebcam} variant="contained" color="primary">
              Start Webcam
            </Button>
          ) : (
            <Button
              onClick={captureImage}
              variant="contained"
              color="secondary"
            >
              Capture Image
            </Button>
          )}
        </>
      )}
      <p>{message}</p>
    </div>
  );
};

export default Webcam;
