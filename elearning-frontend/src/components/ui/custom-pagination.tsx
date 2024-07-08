import { useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

type CustomPaginationProps = {
  total: number;
  page: number;
  pageSize: number;
  onChange: (page: number) => void;
  className?: string;
};

export default function CustomPagination({
  total,
  page,
  pageSize,
  onChange,
  className,
}: CustomPaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const pages = useMemo(
    () => getPageNumbers(totalPages, page),
    [totalPages, page],
  );

  if (total === 0) {
    return null;
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (page > 1) {
                onChange(page - 1);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }
            }}
          />
        </PaginationItem>
        {pages.map((pageNumber, index) => (
          <PaginationItem key={index}>
            {pageNumber === '...' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={pageNumber === page}
                onClick={() => {
                  onChange(pageNumber as number);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (page < totalPages) {
                onChange(page + 1);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const getRange = (start: number, end: number) => {
  return Array(end - start + 1)
    .fill(0)
    .map((_, index) => index + start);
};

const getPageNumbers = (totalPages: number, currentPage: number) => {
  let delta: number;
  if (totalPages <= 7) {
    // delta === 7: [1 2 3 4 5 6 7]
    delta = 7;
  } else {
    // delta === 2: [1 ... 4 5 6 ... 10]
    // delta === 4: [1 2 3 4 5 ... 10]
    delta = currentPage > 4 && currentPage < totalPages - 3 ? 2 : 4;
  }

  const range = {
    start: Math.round(currentPage - delta / 2),
    end: Math.round(currentPage + delta / 2),
  };

  if (range.start - 1 === 1 || range.end + 1 === totalPages) {
    range.start += 1;
    range.end += 1;
  }

  let pages: (string | number)[] =
    currentPage > delta
      ? getRange(
          Math.min(range.start, totalPages - delta),
          Math.min(range.end, totalPages),
        )
      : getRange(1, Math.min(totalPages, delta + 1));

  const withDots = (value: number, pair: (number | string)[]) =>
    pages.length + 1 !== totalPages ? pair : [value];

  if (pages[0] !== 1) {
    pages = withDots(1, [1, '...']).concat(pages);
  }

  if ((pages[pages.length - 1] as number) < totalPages) {
    pages = pages.concat(withDots(totalPages, ['...', totalPages]));
  }

  return pages;
};
