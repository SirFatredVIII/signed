import React, { useRef, useEffect, useCallback, useState } from "react";
import "./sign_detector.css";
import { classifySign } from "@/app/actions/model.action";
import { InputButton } from "../input/button";

declare global {
  interface Window {
    Hands: any;
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

const loadScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.body.appendChild(script);
  });

const areEqual = (
  arr1: string[] | null | undefined,
  arr2: string[] | null | undefined
) => {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

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

interface SignDetectorInterface {
  expectedSigns?: string[];
  stageCompleted?: boolean;
  setStageCompleted?: (stageCompleted: boolean) => void;
  registerStopCamera?: (callback: () => void) => void;
}

const SignDetector: React.FC<SignDetectorInterface> = ({
  expectedSigns,
  stageCompleted = false,
  setStageCompleted,
  registerStopCamera,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [prediction, setPrediction] = useState<string>("");

  const [isHolding, setIsHolding] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownStart = 3;
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const [completedSigns, setCompletedSigns] = useState<string[]>([]);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const currentSignIndexRef = useRef(0);

  useEffect(() => {
    currentSignIndexRef.current = currentSignIndex;
  }, [currentSignIndex]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;

      const handleLoadedMetadata = async () => {
        if (!videoRef.current) return;
        videoRef.current.width = W;
        videoRef.current.height = H;

        try {
          await videoRef.current.play();
          setStreaming(true);
          startTracking();
        } catch (playErr) {
          console.error("Error playing video:", playErr);
        }
      };

      videoRef.current.onloadedmetadata = handleLoadedMetadata;
    } catch (err) {
      console.error("Failed to access camera:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    cleanup();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    setStreaming(false);

    canvasRef.current?.getContext("2d")?.clearRect(0, 0, W, H);
    setHandDetected(false);
  }, []);

  const cleanup = useCallback(async () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (handsRef.current) {
      try {
        await handsRef.current.close();
      } catch (e) {
        console.warn("Hands close error:", e);
      }
      handsRef.current = null;
    }
  }, []);

  const loadMediaPipeScripts = useCallback(async () => {
    await loadScript(
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.min.js"
    );
    await loadScript(
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
    );
  }, []);

  const startTracking = useCallback(async () => {
    await cleanup();

    const hands = new window.Hands({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(async (results: any) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      let data_aux: number[] = [];
      let x_: number[] = [];
      let y_: number[] = [];

      if (
        results.multiHandLandmarks &&
        results.multiHandLandmarks.length > 0 &&
        results.multiHandedness[0].label === "Left"
      ) {
        setHandDetected(true);
        for (const landmarks of results.multiHandLandmarks) {
          window.drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
            color: "#0f0",
            lineWidth: 2,
          });
          window.drawLandmarks(ctx, landmarks, { color: "#f00", lineWidth: 1 });

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
      } else {
        setHandDetected(false);
      }

      if (data_aux.length === DATA_AUX_SIZE) {
        console.log("index: " + currentSignIndexRef.current);
        const prediction = await classifySign(data_aux);
        setPrediction(prediction);

        if (
          expectedSigns !== undefined &&
          prediction === expectedSigns[currentSignIndexRef.current / 2]
        ) {
          setIsHolding(true);
        } else {
          setIsHolding(false);
        }
      }
    });

    handsRef.current = hands;

    const processFrame = async () => {
      if (!videoRef.current || !handsRef.current) return;
      if (handsRef.current.send) {
        try {
          await handsRef.current.send({ image: videoRef.current });
        } catch (e) {
          console.warn("Hands send error:", e);
        }
      }
      rafRef.current = requestAnimationFrame(processFrame);
    };

    !stageCompleted && processFrame();
  }, [cleanup]);

  useEffect(() => {
    if (isHolding) {
      setCountdown(countdownStart);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            setCompletedSigns([...completedSigns, prediction]);
            setCurrentSignIndex((prev) => prev + 1);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(null);
      if (countdownRef.current) clearInterval(countdownRef.current);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isHolding]);

  useEffect(() => {
    console.log(
      "completed vs. expected",
      completedSigns,
      expectedSigns,
      currentSignIndex,
      areEqual(completedSigns, expectedSigns!)
    );
    if (areEqual(completedSigns, expectedSigns) && setStageCompleted) {
      setStageCompleted(true);
    }
  }, [completedSigns]);

  useEffect(() => {
    const init = async () => {
      await loadMediaPipeScripts();
      if (registerStopCamera !== undefined) {
        startCamera();
        registerStopCamera(stopCamera);
      }
    };

    init();

    return () => {
      stopCamera();
    };
  }, [loadMediaPipeScripts, startCamera, startTracking, cleanup, stopCamera]);

  return (
    <div className="webcam-container flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        width={W}
        height={H}
        playsInline
        muted
        className="webcam-video"
      />
      <canvas ref={canvasRef} width={W} height={H} className="webcam-canvas" />
      <p
        className={
          (handDetected ? "visible" : "invisible") +
          " text-center text-2xl font-bold mt-4"
        }
      >
        Letter detected: {prediction}
      </p>
      <p
        className={
          (countdown !== null && !stageCompleted ? "visible" : "invisible") +
          " text-center text-2xl font-bold mt-4"
        }
      >
        Hold for {countdown}...
      </p>
      <div className="flex gap-3 justify-center">
        {registerStopCamera === undefined &&
          (!streaming ? (
            <InputButton
              color={"green"}
              label={"Start Camera"}
              callback={startCamera}
              disabled={streaming}
            />
          ) : (
            <InputButton
              color={"red"}
              label={"Stop Camera"}
              callback={stopCamera}
              disabled={!streaming}
            />
          ))}
      </div>
    </div>
  );
};

export default SignDetector;
