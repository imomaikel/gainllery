import ReactPlayer from 'react-player/lazy';

type TVideo = {
  onLoad: () => void;
  path: string;
};
const Video = ({ onLoad, path }: TVideo) => {
  return (
    <>
      <div className="relative flex h-screen items-center">
        <ReactPlayer
          url={path}
          controls
          width="100%"
          height="100%"
          style={{
            maxHeight: '100vh',
            objectFit: 'contain',
          }}
          onReady={onLoad}
        />
      </div>
    </>
  );
};

export default Video;
