import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";

const ScreenTableSkeleton = () => {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className={'bg-primary/10'}>
                        <TableHead className="w-[100px]">Symbol</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead className={'text-right'}>Analyst Rating</TableHead>
                        <TableHead className={'text-right'}>Risk</TableHead>
                        <TableHead className="text-right">Market Cap</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({length: 7}).map((_, index) => (
                        <TableRow key={index} className={'h-[50px]'}>
                            {Array.from({length: 8}).map((_, cellIndex) => (
                                <TableCell key={cellIndex} className="text-center">
                                    <Skeleton className="h-5 w-full"/>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default ScreenTableSkeleton;