"use client";
import { classifySign } from "@/app/actions/model.action";
import { Button } from "@mui/material";
import Image from "next/image";
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
      videoRef.current = null;
    }
    try {
      const blob = await (await fetch(capturedImage!)).blob();
      const result = await classifySign(blob);
      setMessage(result.message);
    } catch (e) {
      console.error("Error classifying sign:", e);
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
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
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
          <Image
            src={capturedImage}
            alt="Captured"
            height={canvasRef.current?.height}
            width={canvasRef.current?.width}
            className="preview-img"
          />
          <Button onClick={resetState} variant="contained" color="warning">
            Reset
          </Button>
        </>
      ) : (
        <>
          <video ref={videoRef} autoPlay muted className="webcam-video" />
          <canvas ref={canvasRef} className="webcam-canvas" />
          {!mediaStream ? (
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
