import React, { useEffect, useRef, useState } from "react";
import "./sign_detector.css";
import { classifySign } from "@/app/actions/model.action";

declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawConnectors: (
      ctx: CanvasRenderingContext2D,
      landmarks: any,
      connections: any,
      style?: { color?: string; lineWidth?: number }
    ) => void;
    drawLandmarks: (
      ctx: CanvasRenderingContext2D,
      landmarks: any,
      style?: { color?: string; lineWidth?: number }
    ) => void;
  }
}

const HAND_CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4], // Thumb
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8], // Index
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12], // Middle
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16], // Ring
  [13, 17],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20], // Pinky & Palm base
];

const DATA_AUX_SIZE = 42;

const W = 640;
const H = 480;

const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [prediction, setPrediction] = useState<string>("");

  useEffect(() => {
    const loadScripts = async () => {
      const loadScript = (src: string): Promise<void> =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(`Failed to load: ${src}`);
          document.body.appendChild(script);
        });

      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.min.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
        );
        setReady(true);
      } catch (err) {
        console.error(err);
      }
    };

    loadScripts();

    return () => {
      handsRef.current?.close();
      cameraRef.current?.stop();
    };
  }, []);

  const onResults = async (results: any) => {
    if (!canvasRef.current || !videoRef.current || !handsRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    let data_aux: number[] = [];
    let x_: number[] = [];
    let y_: number[] = [];

    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        window.drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 2,
        });

        window.drawLandmarks(ctx, landmarks, {
          color: "#FF0000",
          lineWidth: 1,
        });

        for (const landmark of landmarks) {
          const x = landmark.x;
          const y = landmark.y;
          x_.push(x);
          y_.push(y);
        }

        for (const landmark of landmarks) {
          const x = landmark.x;
          const y = landmark.y;
          data_aux.push(x - Math.min(...x_));
          data_aux.push(y - Math.min(...y_));
        }
      }
    }

    if (data_aux.length === DATA_AUX_SIZE) {
      const prediction = await classifySign(data_aux);
      setPrediction(prediction);
    }
  };

  const startCamera = () => {
    if (!window.Hands || !window.Camera || !videoRef.current) return;

    handsRef.current = new window.Hands({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    handsRef.current.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    handsRef.current.onResults(onResults);

    cameraRef.current = new window.Camera(videoRef.current, {
      onFrame: async () => {
        await handsRef.current.send({ image: videoRef.current! });
      },
      width: W,
      height: H,
    });

    cameraRef.current.start();
    setCameraActive(true);
  };

  const stopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }

    handsRef.current?.close();
    handsRef.current = null;

    if (videoRef.current?.srcObject instanceof MediaStream) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      canvasRef.current.getContext("2d")?.clearRect(0, 0, W, H);
    }
    setCameraActive(false);
    setPrediction("");
  };

  return (
    <div className="webcam-container flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        width={W}
        height={H}
        playsInline
        className="webcam-video"
      />
      <canvas ref={canvasRef} width={W} height={H} className="webcam-canvas" />

      <button
        onClick={cameraActive ? stopCamera : startCamera}
        disabled={!ready}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: ready ? "pointer" : "not-allowed",
        }}
      >
        {ready
          ? cameraActive
            ? "Stop Camera"
            : "Start Camera"
          : "Loading Hand Tracker..."}
      </button>
      <h2>{prediction}</h2>
    </div>
  );
};

export default HandTracker;
