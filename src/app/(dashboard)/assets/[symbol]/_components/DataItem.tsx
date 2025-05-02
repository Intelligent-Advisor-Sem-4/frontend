import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DataItemProps {
    label: string;
    value: React.ReactNode;
}

/**
 * A compact, reusable component for displaying a single data item
 */
export const DataItem: React.FC<DataItemProps> = ({ label, value }) => {
    return (
        <Card className="overflow-hidden shadow-sm p-1">
            <CardContent className="p-2 py-1.5">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="font-medium text-sm">{value}</div>
            </CardContent>
        </Card>
    );
};