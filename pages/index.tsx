import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import WebcamCanvas from '../components/WebcamCanvas';
import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mediapipe pose demo</title>
        <meta name="description" content="Mediapipe pose API" />
      </Head>

      <main className={styles.main}>
        <h1 className="text-green-700 text-2xl font-bold">
          Pose detection demo
        </h1>

        <div>
          <WebcamCanvas />
        </div>
      </main>

      <footer className={styles.footer}>
        <span className={styles.logo}>
          <a href="http://www.biometrical.io">
            <Image
              src="/Bio_Logo_Blue-2.png"
              alt="Biometrical.io Logo"
              width={206.25}
              height={48.875}
            />
          </a>
        </span>
      </footer>
    </div>
  );
};

export default Home;
