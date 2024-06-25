import { useFileContext } from '@/hooks/useFileContext';

const View = () => {
  const { files } = useFileContext();

  return <div>View</div>;
};

export default View;
