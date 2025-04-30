"use client";
import { classifySign } from "@/app/actions/model.action";
import { Button } from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";
import "./webcam.css";

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
        setMessage(null);
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
    try {
      const blob = await (await fetch(capturedImage!)).blob();
      const predictedClass = await classifySign(blob);
      setMessage(predictedClass);
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
        context.save();
        context.scale(-1, 1); // Flip horizontally
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        context.restore();
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
