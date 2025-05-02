'use client';

import React from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Toggle} from "@/components/ui/toggle";
import {ScreenerType} from '../_utils/definitions';

interface ScreenerSelectorProps {
    filter?: string;
    include?: ScreenerType[];
    filterName?: string;
    pageName?: string;
}

export function ScreenerSelector({
                                     filter = ScreenerType.MOST_ACTIVES,
                                     include = [],
                                     filterName = 'filter',
                                        pageName = 'page',

                                 }: ScreenerSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Create an array of screener types excluding any that should be hidden
    const screenerTypes = Object.values(ScreenerType).filter(
        type => include.includes(type as ScreenerType)
    );

    const handleToggleChange = (type: ScreenerType) => {
        // Create a new URLSearchParams object
        const params = new URLSearchParams(searchParams.toString());
        params.set(filterName, type);
        params.set(pageName, '1'); // Reset to page 1 when changing filter

        // Update the URL with the new filter
        router.push(`?${params.toString()}`, {scroll: false});
    };

    // Helper function to format screener types for display
    const formatScreenerName = (type: string): string => {
        return type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="flex flex-wrap gap-2">
            {screenerTypes.map((type) => (
                <Toggle
                    key={type}
                    pressed={filter === type}
                    onPressedChange={() => handleToggleChange(type as ScreenerType)}
                    variant="outline"
                    size="sm"
                    className="data-[state=on]:bg-primary/30 data-[state=on]:text-primary dark:data-[state=on]:text-primary-foreground"
                >
                    {formatScreenerName(type)}
                </Toggle>
            ))}
        </div>
    );
}