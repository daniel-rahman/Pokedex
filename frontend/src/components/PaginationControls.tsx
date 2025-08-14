import type { ChangeEvent } from "react";

interface PaginationControlsProps {
  itemsPerPage: number;
  handleItemsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  currentPage: number;
  totalPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  pokemonListLength: number;
}

function PaginationControls({
  itemsPerPage,
  handleItemsPerPageChange,
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  pokemonListLength,
}: PaginationControlsProps) {
  
  const optionTypes = [
    { value: 5, caption: 5 },
    { value: 10, caption: 10 },
    { value: 20, caption: 20 },
    { value: pokemonListLength, caption: "All" },
  ];

  return (
    <div className="pagination-controls">
      <div>
        <label htmlFor="itemsPerPage">Items per page: </label>
        <select
          id="itemsPerPage"
          className="items-per-page-select"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          {optionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.caption}
            </option>
          ))}
        </select>
      </div>

      <div className="pagination-buttons">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;
