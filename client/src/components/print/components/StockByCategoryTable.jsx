import React from "react";
import { thStyleSimple, tdStyleSimple } from "./TableStyles";

const StockByCategoryTable = ({ stockByCategory }) => {
  if (!stockByCategory || stockByCategory.length === 0) {
    return (
      <p style={{ color: "#888", fontSize: "12px" }}>
        No category data.
      </p>
    );
  }

  const totalStockCount = stockByCategory.reduce((s, c) => s + (c.stock || 0), 0);

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
          <th style={thStyleSimple("left")}>Category</th>
          <th style={thStyleSimple("right")}>Total Stock</th>
          <th style={thStyleSimple("right")}>Share</th>
        </tr>
      </thead>
      <tbody>
        {stockByCategory.map((row, i) => {
          const share =
            totalStockCount > 0
              ? ((row.stock / totalStockCount) * 100).toFixed(1)
              : "0.0";
          return (
            <tr
              key={row.categoryId || i}
              style={{
                backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
              }}
            >
              <td style={tdStyleSimple("left", { fontWeight: 500 })}>
                {row.categoryName}
              </td>
              <td
                style={tdStyleSimple("right", {
                  fontWeight: "bold",
                })}
              >
                {row.stock.toLocaleString()} pcs
              </td>
              <td style={tdStyleSimple("right")}>{share}%</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StockByCategoryTable;
