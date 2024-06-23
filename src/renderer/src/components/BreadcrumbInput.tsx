import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { ElementRef, useEffect, useRef, useState } from 'react';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { BreadcrumbPage } from './ui/breadcrumb';
import { formatPath } from '@/lib/utils';

type TBreadcrumbInput = {
  defaultValue: string;
  onRename: (newName: string) => void;
  whileRenaming: boolean;
  setWhileRenaming: (newState: boolean) => void;
};
const BreadcrumbInput = ({ defaultValue, onRename, setWhileRenaming, whileRenaming }: TBreadcrumbInput) => {
  const ref = useRef<ElementRef<'div'>>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(defaultValue.substring(defaultValue.lastIndexOf('/') + 1));
    setWhileRenaming(false);
  }, [defaultValue]);

  useOnClickOutside(ref, () => {
    if (whileRenaming) setWhileRenaming(false);
  });

  useEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    if (!whileRenaming) return;
    onRename(value);
  });

  return (
    <div ref={ref}>
      {whileRenaming ? (
        <div className="flex items-center space-x-2">
          <input
            className="h-5 max-w-[180px] bg-transparent px-0 py-0 outline-none"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <div
            className="rounded-md bg-background"
            aria-label="change name"
            role="button"
            onClick={() => onRename(value)}
          >
            <MdDriveFileRenameOutline className="h-4 w-4" />
          </div>
        </div>
      ) : (
        <BreadcrumbPage onClick={() => setWhileRenaming(true)}>{formatPath(defaultValue, true)}</BreadcrumbPage>
      )}
    </div>
  );
};

export default BreadcrumbInput;
