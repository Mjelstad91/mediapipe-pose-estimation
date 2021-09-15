import styles from '../styles/Webcam.module.scss';

type WebcamProps = {
  ref: any;
  className: any;
  style: any;
};

const Webcam: React.FC<WebcamProps> = () => {
  // TODO: Replace react-webcam with custom made webcam.

  if (typeof document !== 'undefined') {
    const video: HTMLVideoElement = document.querySelector('#mediaplayer')!;

    //Core
    window.navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream: MediaStream) => {
        if (video) video.srcObject = stream;
        video.onloadedmetadata = (e) => {
          video.play();
        };
      })
      .catch(() => {
        alert('You have to give the browser permissions.');
      });
  }
  return (
    <div className={styles.container}>
      <video id="mediaplayer" autoPlay></video>
    </div>
  );
};

export default Webcam;
