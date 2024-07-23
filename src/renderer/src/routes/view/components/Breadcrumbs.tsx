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
import { useFileContext } from '@/hooks/useFileContext';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

const Breadcrumbs = () => {
  const { selectedFile } = useFileContext();

  const { paths, fileName } = useMemo(() => {
    const splitPath = selectedFile.split('\\');

    const pathsWithName = splitPath.map((name, idx) => ({
      name,
      path: `/browse?path=${splitPath.slice(0, idx + 1).join('\\')}`,
    }));

    const lastItem = splitPath[splitPath.length - 1];
    const ext = lastItem.substring(lastItem.lastIndexOf('.') + 1);
    const name = lastItem.substring(0, lastItem.lastIndexOf('.'));

    const lastFileName = `${name.length >= 24 ? `${name.slice(0, 24)}...` : name}.${ext}`;

    return {
      paths: pathsWithName,
      fileName: lastFileName,
    };
  }, [selectedFile]);

  if (paths.length <= 1) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={paths[0].path}>{paths[0].name}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {paths.length >= 4 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {paths.slice(1, paths.length - 2).map(({ name, path }, idx) => (
                    <DropdownMenuItem key={`menu-${idx}`}>
                      <BreadcrumbLink asChild>
                        <Link to={path}>{name}</Link>
                      </BreadcrumbLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {paths.length >= 3 && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={paths[paths.length - 2].path}>{paths[paths.length - 2].name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage>{fileName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
