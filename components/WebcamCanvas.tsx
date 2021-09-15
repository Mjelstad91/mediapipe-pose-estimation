import { Pose, POSE_CONNECTIONS, Results } from '@mediapipe/pose';
import * as cam from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import Webcam from 'react-webcam';
import React, { useRef, useEffect, useState } from 'react';
import styles from '../styles/WebcamCanvas.module.scss';
import point2Joint from '../utils/point2Joint';
import { NormalizedLandmarkList } from '../assets/pose';

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

  let kneeDistance: number = 0;

  const VIDEO_HEIGHT = 800;
  const VIDEO_WIDTH = 800;

  function onResults(results: Results) {
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

        // Adding biometrical color gradient to lines
        const grad = canvasCtx.createLinearGradient(
          0,
          0,
          VIDEO_WIDTH,
          VIDEO_HEIGHT
        );
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, '#00B5E2');

        // Draws lines between landmarks
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: grad,
          lineWidth: 6,
        });

        let leftLandmarks: NormalizedLandmarkList = [];
        let rightLandmarks: NormalizedLandmarkList = [];
        let knees: NormalizedLandmarkList = [];
        let nose: NormalizedLandmarkList = [];

        // Filter joints to make them any color you'd like..
        results.poseLandmarks &&
          results.poseLandmarks.forEach((e, i) => {
            if (point2Joint(i).includes('KNEE')) {
              knees.push(e);
            } else if (point2Joint(i).includes('RIGHT')) {
              rightLandmarks.push(e);
            } else if (point2Joint(i).includes('LEFT')) {
              leftLandmarks.push(e);
            } else {
              nose.push(e);
            }
          });

        // Left landmarks
        drawLandmarks(canvasCtx, leftLandmarks, {
          color: '#00B5E2',
          lineWidth: 2,
          radius: 3,
          visibilityMin: 0.6,
          fillColor: 'white',
        });

        // Right landmarks
        drawLandmarks(canvasCtx, rightLandmarks, {
          color: '#00B5E2',
          lineWidth: 2,
          radius: 3,
          visibilityMin: 0.6,
          fillColor: 'black',
        });

        // Knees
        drawLandmarks(canvasCtx, knees, {
          color: 'blue',
          lineWidth: 2,
          radius: 2,
          visibilityMin: 0.8,
          fillColor: 'green',
        });

        // Nasen
        drawLandmarks(canvasCtx, nose, {
          color: 'transparent',
          lineWidth: 2,
          radius: 2,
          visibilityMin: 0.6,
          fillColor: 'transparent',
        });

        // Knee-connector
        drawConnectors(canvasCtx, knees, POSE_CONNECTIONS, {
          color: 'white',
          lineWidth: 1,
          radius: 1,
          visibilityMin: 0.8,
        });

        // Euclidian distance between the knees.
        if (knees.length && Array.isArray(knees)) {
          knees.forEach((k) => {
            k.visibility && k.visibility > 0.8
              ? (kneeDistance = Math.hypot(
                  knees[0].x - knees[1].x,
                  knees[0].y - knees[1].y
                ))
              : (kneeDistance = 0);
          });
        }

        const p = document.getElementById('distance');
        p!.innerHTML = kneeDistance.toFixed(2).toString();
        canvasCtx.restore();
      }
    }
  }

  useEffect(() => {
    try {
      // TODO: make static/local import.
      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });

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
            if (webcamRef.current)
              await pose.send({
                image: webcamRef.current.video as HTMLVideoElement,
              });
          },
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
        });
        camera.start();
      }
    } catch (e) {
      console.error('Failed to fetch Mediapipe model. ', e);
    }
  });

  return (
    <div className={styles.container}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '10rem',
        }}
      >
        <p>Knee distance </p>
        <p id="distance"></p>
      </div>

      <h1 className="">Pose detection demo</h1>
      <div
        style={{
          borderColor: kneeDistance > 0.15 ? '#bb2124' : '#22bb33',
          borderWidth: 5,
          borderStyle: 'dotted',
          boxSizing: 'border-box',
        }}
      >
        <Webcam
          ref={webcamRef}
          style={{
            display: 'none',
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 'auto',
          }}
        ></canvas>
      </div>
    </div>
  );
}
export default WebcamCanvas;
