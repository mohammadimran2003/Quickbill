import React from "react";
import { thStyleSimple, tdStyleSimple } from "./TableStyles";

const LowStockTable = ({ topLowStockProducts }) => {
  if (!topLowStockProducts || topLowStockProducts.length === 0) {
    return (
      <p style={{ color: "#888", fontSize: "12px" }}>
        No low stock products.
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
          <th style={thStyleSimple("left")}>Product</th>
          <th style={thStyleSimple("center")}>Stock</th>
          <th style={thStyleSimple("center")}>Limit</th>
        </tr>
      </thead>
      <tbody>
        {topLowStockProducts.slice(0, 5).map((row, i) => (
          <tr
            key={row.id || i}
            style={{
              backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
            }}
          >
            <td style={tdStyleSimple("left", { fontWeight: 500 })}>{row.name}</td>
            <td style={tdStyleSimple("center", { fontWeight: "bold" })}>
              {row.stock}
            </td>
            <td style={tdStyleSimple("center")}>{row.lowStockAlert || 5}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LowStockTable;
