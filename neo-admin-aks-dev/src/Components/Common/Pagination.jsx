import { HiChevronDoubleLeft, HiChevronDoubleRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";

/**
 * Reusable Pagination Component
 * Props: page, totalPages, onPageChange
 */
function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="custom-pagination-wrapper d-flex justify-content-between align-items-center flex-wrap mt-3">
      <div className="page-selector d-flex align-items-center gap-2">
        <p className="mb-0 me-1">Page</p>
        <select
          className="form-select custom-page-dropdown"
          style={{ width: 70 }}
          value={page}
          onChange={e => onPageChange(Number(e.target.value))}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <p className="mb-0 ms-1">of {totalPages}</p>
      </div>

      <nav>
        <ul className="pagination custom-pagination mb-0">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <a className="page-link" href="#" onClick={e => { e.preventDefault(); page !== 1 && onPageChange(1); }}>
              <HiChevronDoubleLeft />
            </a>
          </li>
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <a className="page-link" href="#" onClick={e => { e.preventDefault(); page > 1 && onPageChange(page - 1); }}>
              <HiChevronLeft />
            </a>
          </li>
          <li className="page-item active">
            <a className="page-link" href="#" onClick={e => e.preventDefault()}>{page}</a>
          </li>
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <a className="page-link" href="#" onClick={e => { e.preventDefault(); page < totalPages && onPageChange(page + 1); }}>
              <HiChevronRight />
            </a>
          </li>
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <a className="page-link" href="#" onClick={e => { e.preventDefault(); page !== totalPages && onPageChange(totalPages); }}>
              <HiChevronDoubleRight />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
