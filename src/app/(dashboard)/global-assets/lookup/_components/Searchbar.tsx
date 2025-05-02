"use client";

import {Input} from "@/components/ui/input";
import {Search, Loader2, X} from "lucide-react";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import {useDebounce} from "use-debounce";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {searchYahooFinance} from "../_utils/client_actions";
import {SearchResult} from "../_utils/definitions";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";

function SearchBar({initialQuery = ''}: { initialQuery?: string }) {
    const {resolvedTheme} = useTheme();
    const isDarkMode = resolvedTheme === "dark";
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get the first value from the array returned by useDebounce
    const [debouncedQuery] = useDebounce(searchQuery, 1000);

    // Function to fetch search results
    const fetchSearchResults = async (query: string) => {
        if (query.length < 2) {
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await searchYahooFinance({
                query,
                newsCount: 3,
                quoteCount: 4
            });

            if (response.success) {
                setSearchResults(response.data);
                setIsOpen(true);
            } else {
                setError(response.error);
                setSearchResults(null);
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred");
            setSearchResults(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle debounced query changes
    useEffect(() => {
        if (debouncedQuery.length >= 2) {
            fetchSearchResults(debouncedQuery).then();
        } else {
            setIsOpen(false);
        }
    }, [debouncedQuery]);

    // Handle view all results click
    const handleViewAllResults = () => {
        if (searchQuery) {
            // Update URL with search query
            router.push(`/global-assets/lookup?query=${encodeURIComponent(searchQuery)}`);
            setIsOpen(false);
        }
    };

    const handleClearSearch = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("query");
        router.push(`?${params.toString()}`, {scroll: false});
        setSearchQuery("");
        setIsOpen(false);
    }

    const backgroundImage = "/search-backdrop-light.jpg";

    return (
        <section className="w-full bg-gradient-to-r from-blue-900 to-purple-900">
            <div className="relative w-full h-44 md:h-48">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImage}
                        alt="Search background"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay - lighter for light mode, darker for dark mode */}
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/50' : 'bg-black/40'}`}></div>
                </div>

                {/* Content Container */}
                <div className="relative h-full flex flex-col items-center justify-center px-4 py-8">
                    <h2 className="text-xl md:text-3xl font-bold text-white mb-6">
                        Discover Stocks & Market Insights
                    </h2>

                    {/* Search Input with Popover */}
                    <div className="relative w-full max-w-2xl">
                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                                <div className="relative w-full">
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search stocks, news, companies..."
                                        className="w-full h-12 bg-white/90 dark:bg-gray-800/90 border-0 pl-12 focus-visible:ring-2 focus-visible:ring-offset-0 text-base"
                                    />
                                    {isLoading ? (
                                        <Loader2
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin"/>
                                    ) : (
                                        <Search
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                    )}
                                    <Button
                                        variant="ghost"
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                        onClick={handleClearSearch}
                                        size={'icon'}
                                    >
                                        <X className={"h-5 w-5 text-gray-400"}/>
                                    </Button>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-[calc(100vw-2rem)] max-w-2xl p-0 max-h-[70vh] overflow-auto overscroll-auto"
                                align="start"
                                onOpenAutoFocus={(e) => e.preventDefault()}
                            >
                                <ScrollArea>
                                    <SearchResultsPopup
                                        data={searchResults}
                                        error={error}
                                        onViewAllResults={handleViewAllResults}
                                    />
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SearchResultsPopup({
                                data,
                                error,
                                onViewAllResults
                            }: {
    data: SearchResult | null;
    error: string | null;
    onViewAllResults: () => void;
}) {
    if (error) {
        return (
            <div className="p-4 text-destructive bg-destructive/10">
                Error fetching results: {error}
            </div>
        );
    }

    const {quotes = [], news = []} = data || {};
    const hasResults = quotes.length > 0 || news.length > 0;

    if (!hasResults) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                No results found. Try a different search term.
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {/* Quotes Section */}
            {quotes.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Stocks & Companies</h3>
                    <div className="space-y-2">
                        {quotes.map((quote) => (
                            <Link
                                href={`/assets/${quote.symbol}`}
                                key={quote.symbol}
                                className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-primary">{quote.symbol}</span>
                                    <span className="text-sm truncate max-w-[200px]">{quote.shortName || 'N/A'}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {quote.exchange || 'N/A'}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* News Section */}
            {news.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Latest News</h3>
                    <div className="space-y-3">
                        {news.map((item) => (
                            <Link
                                href={item.link}
                                key={item.uuid}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2 hover:bg-muted rounded-md transition-colors"
                            >
                                <div className="flex gap-3">
                                    {item.thumbnail && (
                                        <div
                                            className="relative w-16 h-16 flex-shrink-0 bg-muted rounded overflow-hidden">
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm line-clamp-2">{item.title}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-muted-foreground">{item.publisher}</span>
                                            {item.relatedTickers && item.relatedTickers.length > 0 && (
                                                <div className="flex gap-1">
                                                    {item.relatedTickers.slice(0, 2).map((ticker) => (
                                                        <Badge key={ticker} variant="outline"
                                                               className="text-xs px-1 py-0 h-5">
                                                            {ticker}
                                                        </Badge>
                                                    ))}
                                                    {item.relatedTickers.length > 2 && (
                                                        <span
                                                            className="text-xs text-muted-foreground">+{item.relatedTickers.length - 2}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* View all results link */}
            <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-2">
                <button
                    onClick={onViewAllResults}
                    className="text-sm text-primary hover:underline p-2"
                >
                    View all results
                </button>
            </div>
        </div>
    );
}

export default SearchBar;