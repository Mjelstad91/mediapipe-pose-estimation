import { Pose, POSE_CONNECTIONS, PoseConfig, Results } from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import Webcam from 'react-webcam';
import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/WebcamCanvas.module.scss';

import { FPS, Slider, Toggle } from '@mediapipe/control_utils';
function WebcamCanvas() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // TODO: Add config-modifiers to GUI
  const [modComplexity, setModCompleixty] = useState<number>(1);
  const [smoothLandmarks, setSmoothLandmarks] = useState<boolean>(true);
  const [enableSegmentation, setEnableSegmentation] = useState<boolean>(true);
  const [smoothSegmentation, setSmoothSegmentation] = useState<boolean>(true);
  const [minDetectionConf, setMinDetectionConf] = useState<number>(0.5);
  const [minTrackingConf, setMinTrackingConf] = useState<number>(0.5);
  let camera = null;

  const VIDEO_HEIGHT = 500;
  const VIDEO_WIDTH = 500;
  const BioLogo = () => (
    <div>
      <img
        src="./icon_blue-2.png"
        className={styles.bioLogo}
        width={VIDEO_WIDTH / 10}
      />
    </div>
  );

  function onResults(results: Results) {
    // console.log('results: ', results);
    // console.log('results.poseWorldLandmarks: ', results.poseWorldLandmarks);

    if (canvasRef.current && webcamRef.current && webcamRef.current.video) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext('2d');

      if (canvasCtx) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        // Draws lines between landmarks
        const grad = canvasCtx.createLinearGradient(
          0,
          0,
          VIDEO_WIDTH,
          VIDEO_HEIGHT
        );
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, '#00B5E2');
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: grad,
          lineWidth: 6,
        });

        // Draws landmarks (dots)
        drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: '#00B5E2',
          lineWidth: 2,
          radius: 2,
        });
        // drawLandmarks(canvasCtx, results.poseWorldLandmarks, {
        //   color: 'yellow',
        //   lineWidth: 2,
        //   radius: 2,
        // });
        canvasCtx.restore();
      }
    }
  }
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });
    /* 
    static_image_mode
    model_complexity
    smooth_landmarks
    enable_segmentation
    smooth_segmentation
    min_detection_confidence
    min_tracking_confidence
    */
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    pose.onResults(onResults);
    if (webcamRef.current && webcamRef.current.video) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current!.video as any });
        },
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
      });
      camera.start();
    }
  });
  return (
    <div className={styles.container}>
      <BioLogo />
      <div className="canvasWebcamWrapper">
        <Webcam
          ref={webcamRef}
          className={styles.webcam}
          style={{
            display: 'none',
          }}
        />
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          style={{
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT,
          }}
        ></canvas>
      </div>
    </div>
  );
}
export default WebcamCanvas;
