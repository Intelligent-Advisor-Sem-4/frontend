"use client"

import {format} from "date-fns"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import { PredictionItem} from "@/lib/types/stock_prediction";

interface StockDataTableProps {
    data: PredictionItem[]
}

export default function StockDataTable({data}: StockDataTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Predicted Price</TableHead>
                        <TableHead>Confidence Interval</TableHead>
                        <TableHead>Change</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{format(new Date(item.date), "MMM dd, yyyy")}</TableCell>
                            <TableCell>${item.predicted.toFixed(2)}</TableCell>
                            <TableCell>
                                ${item.confidenceLow.toFixed(2)} - ${item.confidenceHigh.toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <Badge variant={item.change > 0 ? "success" : "destructive"}>
                                    {item.change > 0 ? "+" : ""}
                                    {item.change.toFixed(2)}%
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
