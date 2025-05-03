// "use client";
// // import { classifySign } from "@/app/actions/model.action";
// import { Button } from "@mui/material";
// // import Image from "next/image";
// // import { useRef, useState } from "react";
// import "./sign_detector.css";

// const { Hands } = await import("@mediapipe/hands");
// const { Camera } = await import("@mediapipe/camera_utils");
// import * as cam from "@mediapipe/camera_utils";
// import Webcam from "react-webcam";
// import { useEffect, useRef, useState } from "react";
// import { classifySign } from "@/app/actions/model.action";

// const DATA_AUX_SIZE = 42;
// const W = 640;
// const H = 480;

// const SignDetector = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [prediction, setPrediction] = useState<string>("");
//   const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

//   const startWebcam = async () => {
//     if (videoRef.current && canvasRef.current) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });
//         videoRef.current.srcObject = stream;
//         setMediaStream(stream);
//       } catch (error) {
//         console.error("Error accessing webcam:", error);
//       }
//     }
//   };

//   const stopWebcam = async () => {
//     if (mediaStream) {
//       mediaStream.getTracks().forEach((track) => track.stop());
//       setMediaStream(null);
//       videoRef.current!.srcObject = null;
//       canvasRef.current!.getContext("2d")?.clearRect(0, 0, W, H);
//     }
//   };

//     useEffect(() => {
//       const hands = new Hands({
//         locateFile: (file) =>
//           `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//       });

//       hands.setOptions({
//         maxNumHands: 1,
//         modelComplexity: 1,
//         minDetectionConfidence: 0.7,
//         minTrackingConfidence: 0.5,
//       });

//       hands.onResults(async (results) => {
//         const landmarks = results.multiHandLandmarks?.[0];
//         if (!landmarks) return;

//         const xVals = landmarks.map((lm) => lm.x);
//         const yVals = landmarks.map((lm) => lm.y);
//         const xMin = Math.min(...xVals);
//         const yMin = Math.min(...yVals);

//         const dataAux = landmarks.flatMap((lm) => [lm.x - xMin, lm.y - yMin]);

//         if (dataAux.length === DATA_AUX_SIZE) {
//           const prediction = await classifySign(dataAux);
//           setPrediction(prediction);
//         }

//         if (canvasRef.current) {
//           const canvasCtx = canvasRef.current.getContext("2d");
//           if (results.image && canvasCtx) {
//             canvasCtx.clearRect(
//               0,
//               0,
//               canvasRef.current.width,
//               canvasRef.current.height
//             );
//             canvasCtx.drawImage(
//               results.image,
//               0,
//               0,
//               canvasRef.current.width,
//               canvasRef.current.height
//             );

//             for (const landmark of landmarks) {
//               canvasCtx.beginPath();
//               canvasCtx.arc(
//                 landmark.x * canvasRef.current.width,
//                 landmark.y * canvasRef.current.height,
//                 5,
//                 0,
//                 2 * Math.PI
//               );
//               canvasCtx.fillStyle = "red";
//               canvasCtx.fill();
//             }
//           }
//         }
//       });

//       if (videoRef.current && videoRef.current) {
//         const camera = new Camera(videoRef.current, {
//           onFrame: async () =>
//             await hands.send({
//               image: videoRef.current as HTMLVideoElement,
//             }),
//           width: W,
//           height: H,
//         });
//         camera.start();
//       }
//     }, [mediaStream]);

//     return (
//       <div>
//         {/* <Webcam
//           ref={videoRef}
//           width={W}
//           height={H}
//           style={{ display: "none" }}
//         /> */}
//         {/* <video ref={videoRef} /> */}
//         <canvas
//           ref={canvasRef}
//           width={W}
//           height={H}
//           // style={{ position: "absolute" }}
//         />
//         {!mediaStream ? (
//           <Button onClick={startWebcam}>Start Webcam</Button>
//         ) : (
//           <Button onClick={stopWebcam}>Stop Webcam</Button>
//         )}
//         <h2 className="text-2xl mt-2">Prediction: {prediction}</h2>
//       </div>
//     );
//   };
//   useEffect(() => {
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
//       }
//     }

//     const hands = new Hands({
//       locateFile: (file) =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//     });

//     hands.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.7,
//       minTrackingConfidence: 0.5,
//     });

//     hands.onResults(async (results) => {
//       const landmarks = results.multiHandLandmarks?.[0];
//       if (!landmarks) return;

//       const xVals = landmarks.map((lm) => lm.x);
//       const yVals = landmarks.map((lm) => lm.y);
//       const xMin = Math.min(...xVals);
//       const yMin = Math.min(...yVals);

//       const dataAux = landmarks.flatMap((lm) => [lm.x - xMin, lm.y - yMin]);

//       if (dataAux.length === DATA_AUX_SIZE) {
//         const prediction = await classifySign(dataAux);
//         setPrediction(prediction);
//       }
//     });
//   }, []);

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
//         // setCapturedImage(canvas.toDataURL("image/png"));
//       }
//     }
//   };

//   // const resetState = () => {
//   //   stopWebcam();
//   //   setCapturedImage(null);
//   // };

//   return (
//     <div className="webcam-container flex flex-col items-center justify-center">
//       <video ref={videoRef} autoPlay muted className="webcam-video" />
//       <canvas ref={canvasRef} className="webcam-canvas" />
//       {!mediaStream ? (
//         <Button onClick={startWebcam} variant="contained" color="primary">
//           Start Webcam
//         </Button>
//       ) : (
//         <Button onClick={stopWebcam} variant="contained" color="secondary">
//           Stop Webcam
//         </Button>
//       )}
//       <p>{prediction ? prediction : "Try yourself!"}</p>
//     </div>
//   );
// };

// export default SignDetector;
