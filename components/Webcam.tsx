import styles from '../styles/Webcam.module.scss';

const Webcam: React.FC = () => {
  // TODO: Replace react-webcam with custom made webcam.

  if (typeof document !== 'undefined') {
    const video: HTMLVideoElement = document.querySelector('#myVidPlayer')!;

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
        alert('You have give browser the permission to run Webcam and mic ;( ');
      });
  }
  return (
    <div className={styles.container}>
      <video id="myVidPlayer" autoPlay></video>
    </div>
  );
};

export default Webcam;
