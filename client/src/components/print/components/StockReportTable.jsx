import React from "react";
import { thStyleSimple, tdStyleSimple } from "./TableStyles";

const StockReportTable = ({ stockDetails }) => {
  if (!stockDetails || stockDetails.length === 0) {
    return (
      <p style={{ color: "#888", fontSize: "12px" }}>
        No stock data recorded for this period.
      </p>
    );
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "12px",
      }}
    >
      <thead>
        <tr>
          <th style={thStyleSimple("left")}>Product Name</th>
          <th style={thStyleSimple("right")}>Opening</th>
          <th style={thStyleSimple("right")}>Stock In</th>
          <th style={thStyleSimple("right")}>Stock Out</th>
          <th style={thStyleSimple("center")}>Current</th>
          <th style={thStyleSimple("center")}>Alert Limit</th>
          <th style={thStyleSimple("right")}>Cost Price</th>
          <th style={thStyleSimple("right")}>Total Value</th>
          <th style={thStyleSimple("center")}>Status</th>
        </tr>
      </thead>
      <tbody>
        {stockDetails.map((row, i) => {
          const currentStock = row.currentStock || 0;
          const costPrice = row.costPrice || 0;
          const totalValue = currentStock > 0 ? currentStock * costPrice : 0;
          const isLow = currentStock > 0 && currentStock <= (row.lowStockAlert || 5);
          const isOut = currentStock <= 0;

          let statusText = "In Stock";
          if (isOut) statusText = "Out of Stock";
          else if (isLow) statusText = "Low Stock";

          return (
            <tr
              key={row.productId || i}
              style={{
                backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
              }}
            >
              <td style={tdStyleSimple("left", { fontWeight: 500 })}>{row.name}</td>
              <td style={tdStyleSimple("right")}>{row.openingStock}</td>
              <td style={tdStyleSimple("right")}>+{row.stockIn}</td>
              <td style={tdStyleSimple("right")}>-{row.stockOut}</td>
              <td style={tdStyleSimple("center", { fontWeight: "bold" })}>
                {currentStock}
              </td>
              <td style={tdStyleSimple("center")}>{row.lowStockAlert}</td>
              <td style={tdStyleSimple("right")}>
                ৳{costPrice.toLocaleString()}
              </td>
              <td style={tdStyleSimple("right", { fontWeight: "bold" })}>
                ৳{totalValue.toLocaleString()}
              </td>
              <td style={tdStyleSimple("center")}>
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 600,
                  }}
                >
                  {statusText}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StockReportTable;
