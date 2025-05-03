"use client"

import { useEffect, useState } from "react"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from "recharts"
import { format } from "date-fns"

interface StockPredictionChartProps {
  historicalData: any[]
  predictionData: any[]
}

export default function StockPredictionChart({ historicalData, predictionData }: StockPredictionChartProps) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // Combine historical and prediction data
    const historical = historicalData.map((item) => ({
      ...item,
      formattedDate: format(new Date(item.date), "MMM dd"),
      predicted: null,
      confidenceLow: null,
      confidenceHigh: null,
    }))

    const predictions = predictionData.map((item) => ({
      date: item.date,
      formattedDate: format(new Date(item.date), "MMM dd"),
      price: null, // No actual price for future dates
      predicted: item.predicted,
      confidenceLow: item.confidenceLow,
      confidenceHigh: item.confidenceHigh,
    }))

    // Combine the data sets
    setChartData([...historical, ...predictions])
  }, [historicalData, predictionData])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) => {
            if (value === null) return ["-", name]
            return name === "Price" || name === "Predicted" ? [`$${value}`, name] : [`$${value}`, name]
          }}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ r: 1 }}
          activeDot={{ r: 5 }}
          name="Price"
        />
        <Line
          type="monotone"
          dataKey="predicted"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 1 }}
          activeDot={{ r: 5 }}
          name="Predicted"
        />
        <Area type="monotone" dataKey="confidenceLow" stackId="1" stroke="none" fill="#10b98120" name="Lower Bound" />
        <Area type="monotone" dataKey="confidenceHigh" stackId="1" stroke="none" fill="#10b98120" name="Upper Bound" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
