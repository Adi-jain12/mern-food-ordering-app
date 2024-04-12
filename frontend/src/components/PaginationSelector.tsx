import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const PaginationSelector = ({ page, pages, onPageChange }: Props) => {
  const pageNumbers = [];

  // pages = 4
  // pageNumbers = [1,2,3,4]
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i); //looping and pushing i value in array for storing page numbers to display in pagination
  }

  return (
    <Pagination>
      <PaginationContent>
        {page !== 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => onPageChange(page - 1)}
            />
          </PaginationItem>
        )}
        {pageNumbers.map((number) => (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(number)}
              isActive={page === number} //for styling so that we can identify if we are on page on what we clicked
            >
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* only display previos page button if cuurent page is not equal to total pageNumbers length
        
        pageNumber = [1,2,3,4]
        page = 2 //will display the button
        page = 4 // will not display the button
        
        */}
        {page !== pageNumbers.length && (
          <PaginationItem>
            <PaginationNext href="#" onClick={() => onPageChange(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSelector;
