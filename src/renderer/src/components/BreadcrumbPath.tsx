import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import BreadcrumbInput from './BreadcrumbInput';
import { formatPath } from '@/lib/utils';
import { useMemo } from 'react';

type TBreadcrumbData =
  | {
      moreThanThree: true;
      firstPath: string;
      restPaths: string[];
      nextToLast: string;
      lastPath: string;
    }
  | {
      moreThanThree: false;
      path1: string;
      path2: string | undefined;
      path3: string | undefined;
    };

type TBreadcrumbPath = {
  currentPath: string;
  selectDirectory: (path: string) => void;
  onRename: (path: string, newName: string) => void;
  whileRenaming: boolean;
  setWhileRenaming: (newState: boolean) => void;
};
const BreadcrumbPath = ({
  currentPath,
  selectDirectory,
  onRename,
  whileRenaming,
  setWhileRenaming,
}: TBreadcrumbPath) => {
  const data: TBreadcrumbData = useMemo(() => {
    const pathList = currentPath.split('/').filter((path) => path.length);

    if (pathList.length >= 4) {
      const firstPath = '/' + pathList[0];
      const lastPath = currentPath;
      const nextToLast = '/' + pathList.slice(0, pathList.length - 1).join('/');

      const restPaths = pathList
        .slice(1, pathList.length - 2)
        .map((_, idx) => `/${pathList.slice(0, idx + 2).join('/')}`);

      return { moreThanThree: true, firstPath, restPaths, nextToLast, lastPath };
    } else {
      const path1 = '/' + pathList[0];

      const path2 = pathList[1] ? '/' + pathList.slice(0, 2).join('/') : undefined;
      const path3 = pathList[2] ? '/' + pathList.slice(0, 3).join('/') : undefined;

      return { moreThanThree: false, path1, path2, path3 };
    }
  }, [currentPath]);

  const handlePathClick = (path: string | undefined) => {
    if (!path) return;
    selectDirectory(path);
  };

  return (
    <div className="fixed top-0 h-5 w-screen">
      <div className="flex items-center justify-center">
        <Breadcrumb className="rounded-bl-md rounded-br-md bg-background/75 px-1 pb-1 opacity-75 transition-opacity hover:opacity-100">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{data.moreThanThree ? data.firstPath : data.path1}</BreadcrumbPage>
            </BreadcrumbItem>

            {!data.moreThanThree ? (
              <>
                {data.path2 && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <div role="button" aria-label="open directory" onClick={() => handlePathClick(data.path2)}>
                          {formatPath(data.path2, data.path3 ? false : true)}
                        </div>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}

                {data.path3 && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <div role="button" aria-label="open directory" onClick={() => handlePathClick(data.path3)}>
                          {formatPath(data.path3, true)}
                        </div>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            ) : (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <BreadcrumbEllipsis className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {data.restPaths.map((path, idx) => (
                        <DropdownMenuItem key={`path-${idx}`} onClick={() => handlePathClick(path)}>
                          {formatPath(path)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <div role="button" aria-label="open directory" onClick={() => handlePathClick(data.nextToLast)}>
                      {formatPath(data.nextToLast)}
                    </div>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbInput
                    defaultValue={data.lastPath}
                    onRename={(newName) => {
                      onRename(data.lastPath, newName);
                    }}
                    setWhileRenaming={setWhileRenaming}
                    whileRenaming={whileRenaming}
                  />
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadcrumbPath;
