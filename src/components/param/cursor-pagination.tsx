import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useSearch } from "@tanstack/react-router";
import Select from "../ui/select";
import { PaginationProps } from "./pagination";

const CursorPagination: React.FC<
  PaginationProps & {
    changePageSize?: boolean;
    next: string | null | undefined;
    previous: string | null | undefined;
  }
> = ({
  page_sizes = [10, 25, 50, 75, 100],
  paramName = "cursor",
  pageSizeParamName = "page_size",
  disabled = false,
  changePageSize = true,
  pageSize = 25,
  next = null,
  previous = null,
}) => {
  const navigate = useNavigate();
  const search: any = useSearch({ from: "__root__" }) as Record<
    string,
    string | undefined
  >;

  const getCursorFromUrl = (url: string | null) => {
    if (!url) return null;
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return urlParams.get(paramName);
  };

  const handlePrevious = () => {
    const prevCursor = getCursorFromUrl(previous);
    navigate({
      search: {
        ...search,
        [paramName]: prevCursor,
        [pageSizeParamName]: undefined,
      },
    });
  };

  const handleNext = () => {
    const nextCursor = getCursorFromUrl(next);
    navigate({
      search: {
        ...search,
        [paramName]: nextCursor,
        [pageSizeParamName]: undefined,
      },
    });
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        disabled={disabled || !previous}
        icon={<ChevronLeft width={20} />}
        variant="ghost"
        onClick={handlePrevious}
        size="icon"
        aria-label="Previous Page"
        className="w-7 h-7 mt-1 sm:m-0 sm:w-10 sm:h-10"
      />
      <Button
        disabled={disabled || !next}
        icon={<ChevronRight width={20} />}
        variant="ghost"
        onClick={handleNext}
        size="icon"
        aria-label="Next Page"
        className="w-7 h-7 mt-1 sm:m-0 sm:w-10 sm:h-10"
      />
      {changePageSize && (
        <Select
          disabled={disabled}
          className="w-20 h-8 sm:h-10"
          label=""
          options={page_sizes?.map((size) => ({
            name: `${size}`,
            id: `${size}`,
          }))}
          value={search[pageSizeParamName] || pageSize}
          setValue={(value) =>
            navigate({
              search: { ...search, [pageSizeParamName]: +value },
            })
          }
        />
      )}
    </div>
  );
};

export default CursorPagination;
