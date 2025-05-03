// Export data to CSV format
export function exportToCSV(data: any, filename: string) {
    if (!data || !data.predictions || data.predictions.length === 0) {
      console.error("No data to export")
      return
    }
  
    // Extract predictions array
    const predictions = data.predictions
  
    // Create CSV header
    const headers = ["Date", "Predicted Price", "Lower Confidence", "Upper Confidence", "Change (%)"]
  
    // Create CSV rows
    const rows = predictions.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.predicted.toFixed(2),
      item.confidenceLow.toFixed(2),
      item.confidenceHigh.toFixed(2),
      item.change.toFixed(2),
    ])
  
    // Combine header and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
  
    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
  
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
  
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  