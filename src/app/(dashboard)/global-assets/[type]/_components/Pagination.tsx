'use client'

import {useSearchParams} from "next/navigation";
import {useRouter} from "next/navigation";
import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function Pagination({
                                       totalItems,
                                       itemsPerPage = 10,
                                       page,
                                       parameterName = "page",
                                   }: {
    page: number;
    totalItems?: number;
    itemsPerPage?: number;
    parameterName?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get current page from URL or default to 1
    // const currentPage = parseInt(searchParams.get("page") || "1", 10);
    const currentPage = page;

    // Calculate total pages - if totalItems is not provided, we'll just show prev/next
    const showPageNumbers = totalItems !== undefined;
    const totalPages = showPageNumbers ? Math.ceil(totalItems / itemsPerPage) : null;

    // Handle page change with proper type for newPage
    const handlePageChange = (newPage: number) => {
        // Create a new URLSearchParams object from the current search params
        const params = new URLSearchParams(searchParams.toString());

        // Set the page parameter
        params.set(parameterName, newPage.toString());

        // Update the URL with the new search params
        router.push(`?${params.toString()}`, {scroll: false});
    };

    // Simplified version focusing on just current page, prev and next buttons
    return (
        <ShadcnPagination className="justify-end">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {/* Just show current page */}
                <PaginationItem>
                    <PaginationLink isActive={true} className="cursor-pointer">
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            // If we don't know totalPages or if we're not on the last page
                            if (!totalPages || currentPage < totalPages) {
                                handlePageChange(currentPage + 1);
                            }
                        }}
                        className={(totalPages !== null && currentPage >= totalPages) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </ShadcnPagination>
    );
}