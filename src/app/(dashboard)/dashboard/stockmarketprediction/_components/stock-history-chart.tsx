"use client"

import {useEffect, useState} from "react"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import {format} from "date-fns"
import {StockHistoryItem} from "@/lib/types/stock_prediction";

interface StockHistoryChartProps {
    data: StockHistoryItem[]
    dataKey?: string
    chartType?: "line" | "bar"
}

export default function StockHistoryChart({data, dataKey = "price", chartType = "line"}: StockHistoryChartProps) {
    const [chartData, setChartData] = useState<StockHistoryItem[]>([])

    useEffect(() => {
        // Format dates for the chart
        const formattedData = data.map((item) => ({
            ...item,
            formattedDate: format(new Date(item.date), "MMM dd"),
        }))
        setChartData(formattedData)
    }, [data])

    const renderChart = () => {
        if (chartType === "line") {
            return (
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="formattedDate" tick={{fontSize: 12}} interval="preserveStartEnd"/>
                    <YAxis domain={dataKey === "price" ? ["auto", "auto"] : [0, "auto"]} tick={{fontSize: 12}}/>
                    <Tooltip
                        formatter={(value) => {
                            return dataKey === "price" ? [`$${value}`, "Price"] : [value.toLocaleString(), "Volume"]
                        }}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend/>
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{r: 1}}
                        activeDot={{r: 5}}
                        name={dataKey === "price" ? "Price" : "Volume"}
                    />
                </LineChart>
            )
        } else {
            return (
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="formattedDate" tick={{fontSize: 12}} interval="preserveStartEnd"/>
                    <YAxis tick={{fontSize: 12}}/>
                    <Tooltip
                        formatter={(value) => [value.toLocaleString(), dataKey === "price" ? "Price" : "Volume"]}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend/>
                    <Bar dataKey={dataKey} fill="#2563eb" name={dataKey === "price" ? "Price" : "Volume"}/>
                </BarChart>
            )
        }
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
        </ResponsiveContainer>
    )
}
