import { HashLoader } from 'react-spinners';

type TLoadingScreen = {
  showExtraText?: boolean;
};
const LoadingScreen = ({ showExtraText }: TLoadingScreen) => {
  return (
    <div className="mt-4 flex items-center justify-center space-x-6">
      <HashLoader color="#6d28d9" speedMultiplier={1.25} />
      <div className="flex flex-col">
        <p className="text-lg font-bold">Please wait...</p>
        {showExtraText && (
          <p className="text-sm text-muted-foreground">
            There are a lot of files
            <br /> It can take a while
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
