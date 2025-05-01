"use client";
// import { classifySign } from "@/app/actions/model.action";
// import { Button } from "@mui/material";
// import Image from "next/image";
// import { useRef, useState } from "react";
// import "./webcam.css";

import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";
import { classifySign } from "@/app/actions/model.action";

const DATA_AUX_SIZE = 42;
const W = 640;
const H = 480;

const SignDetector = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prediction, setPrediction] = useState<string>("");

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(async (results) => {
      const landmarks = results.multiHandLandmarks?.[0];
      if (!landmarks) return;

      const xVals = landmarks.map((lm) => lm.x);
      const yVals = landmarks.map((lm) => lm.y);
      const xMin = Math.min(...xVals);
      const yMin = Math.min(...yVals);

      const dataAux = landmarks.flatMap((lm) => [lm.x - xMin, lm.y - yMin]);

      if (dataAux.length === DATA_AUX_SIZE) {
        const prediction = await classifySign(dataAux);
        setPrediction(prediction);
      }

      if (canvasRef.current) {
        const canvasCtx = canvasRef.current.getContext("2d");
        if (results.image && canvasCtx) {
          canvasCtx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          for (const landmark of landmarks) {
            canvasCtx.beginPath();
            canvasCtx.arc(
              landmark.x * canvasRef.current.width,
              landmark.y * canvasRef.current.height,
              5,
              0,
              2 * Math.PI
            );
            canvasCtx.fillStyle = "red";
            canvasCtx.fill();
          }
        }
      }
    });

    if (webcamRef.current && webcamRef.current.video) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () =>
          await hands.send({
            image: webcamRef.current?.video as HTMLVideoElement,
          }),
        width: W,
        height: H,
      });
      camera.start();
    }
  }, []);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        width={W}
        height={H}
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ position: "absolute" }}
      />
      <h2 className="text-2xl mt-2">Prediction: {prediction}</h2>
    </div>
  );
};

//   const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);

//   const startWebcam = async () => {
//     if (videoRef.current && canvasRef.current) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });
//         videoRef.current.srcObject = stream;
//         setMediaStream(stream);
//         setMessage(null);
//       } catch (error) {
//         console.error("Error accessing webcam:", error);
//       }
//     }
//   };

//   const stopWebcam = async () => {
//     if (mediaStream) {
//       mediaStream.getTracks().forEach((track) => track.stop());
//       setMediaStream(null);
//     }
//     try {
//       const blob = await (await fetch(capturedImage!)).blob();
//       const predictedClass = await classifySign(blob);
//       setMessage(predictedClass);
//     } catch (e) {
//       console.error("Error classifying sign:", e);
//     }
//   };

//   const captureImage = () => {
//     if (canvasRef.current && videoRef.current) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const context = canvasRef.current.getContext("2d");

//       // Set canvas dimensions to match video stream
//       if (context && video.videoWidth && video.videoHeight) {
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         // Draw video frame onto canvas
//         context.save();
//         context.scale(-1, 1); // Flip horizontally
//         context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
//         context.restore();
//         // Get image data URL from canvas
//         setCapturedImage(canvas.toDataURL("image/png"));
//       }
//     }
//   };

//   const resetState = () => {
//     stopWebcam();
//     setCapturedImage(null);
//   };

//   return (
//     <div className="webcam-container flex flex-col items-center justify-center">
//       {capturedImage ? (
//         <>
//           <Image
//             src={capturedImage}
//             alt="Captured"
//             height={canvasRef.current?.height}
//             width={canvasRef.current?.width}
//             className="preview-img"
//           />
//           <Button onClick={resetState} variant="contained" color="warning">
//             Reset
//           </Button>
//         </>
//       ) : (
//         <>
//           <video ref={videoRef} autoPlay muted className="webcam-video" />
//           <canvas ref={canvasRef} className="webcam-canvas" />
//           {!mediaStream ? (
//             <Button onClick={startWebcam} variant="contained" color="primary">
//               Start Webcam
//             </Button>
//           ) : (
//             <Button
//               onClick={captureImage}
//               variant="contained"
//               color="secondary"
//             >
//               Capture Image
//             </Button>
//           )}
//         </>
//       )}
//       <p>{message}</p>
//     </div>
//   );
// };

export default SignDetector;
