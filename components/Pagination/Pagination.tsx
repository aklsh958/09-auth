import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
}

export default function Pagination({ totalPages, currentPage, setPage }: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      containerClassName={css.pagination}
      activeClassName={css.active}
      onPageChange={({ selected }) => setPage(selected + 1)}
      forcePage={currentPage - 1}
      renderOnZeroPageCount={null}
    />
  );
}