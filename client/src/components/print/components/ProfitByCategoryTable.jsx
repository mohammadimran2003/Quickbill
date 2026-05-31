import React from "react";
import fmt from "../../../utils/fmt";
import { thStyle, tdStyle } from "./TableStyles";

const ProfitByCategoryTable = ({ profitByCategory }) => {
  if (!profitByCategory || profitByCategory.length === 0) {
    return (
      <p style={{ color: "#888", fontSize: "12px" }}>
        No category data for this period.
      </p>
    );
  }

  const totalCatRevenue = profitByCategory.reduce(
    (s, c) => s + (c.totalRevenue || 0),
    0,
  );

  return (
    <div style={{ pageBreakInside: "avoid" }}>
      <h2
        style={{
          fontSize: "15px",
          margin: "0 0 12px",
          color: "#333",
          borderLeft: "4px solid #A78BFA",
          paddingLeft: "10px",
        }}
      >
        Profit by Category
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle("left")}>Category</th>
            <th style={thStyle("right")}>Revenue</th>
            <th style={thStyle("right")}>Cost</th>
            <th style={thStyle("right")}>Net Profit</th>
            <th style={thStyle("right")}>Margin %</th>
            <th style={thStyle("right")}>Revenue Share</th>
          </tr>
        </thead>
        <tbody>
          {profitByCategory.map((cat, i) => {
            const share =
              totalCatRevenue > 0
                ? ((cat.totalRevenue / totalCatRevenue) * 100).toFixed(1)
                : "0.0";
            return (
              <tr
                key={cat.categoryId || i}
                style={{
                  backgroundColor:
                    i === 0 ? "#F3E8FF" : i % 2 === 0 ? "#fff" : "#fafafa",
                }}
              >
                <td
                  style={tdStyle("left", {
                    fontWeight: i === 0 ? 700 : 500,
                  })}
                >
                  {cat.categoryName}
                </td>
                <td style={tdStyle("right")}>{fmt(cat.totalRevenue)}</td>
                <td style={tdStyle("right", { color: "#888" })}>
                  {fmt(cat.totalCost)}
                </td>
                <td
                  style={tdStyle("right", {
                    fontWeight: 700,
                    color: cat.netProfit >= 0 ? "#00A76F" : "#B71D2B",
                  })}
                >
                  {fmt(cat.netProfit)}
                </td>
                <td style={tdStyle("right")}>
                  <span
                    style={{
                      backgroundColor:
                        cat.profitMargin >= 20 ? "#E8F8F2" : "#FFF8E1",
                      color:
                        cat.profitMargin >= 20 ? "#00A76F" : "#FFAB00",
                      padding: "2px 7px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {cat.profitMargin}%
                  </span>
                </td>
                <td style={tdStyle("right", { color: "#555" })}>{share}%</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr
            style={{
              backgroundColor: "#f0f0f0",
              fontWeight: 700,
              borderTop: "2px solid #ccc",
            }}
          >
            <td style={tdStyle("left", { fontWeight: 700 })}>Total</td>
            <td style={tdStyle("right", { fontWeight: 700 })}>
              {fmt(
                profitByCategory.reduce((s, c) => s + (c.totalRevenue || 0), 0),
              )}
            </td>
            <td
              style={tdStyle("right", { fontWeight: 700, color: "#888" })}
            >
              {fmt(
                profitByCategory.reduce((s, c) => s + (c.totalCost || 0), 0),
              )}
            </td>
            <td
              style={tdStyle("right", {
                fontWeight: 700,
                color: "#00A76F",
              })}
            >
              {fmt(
                profitByCategory.reduce((s, c) => s + (c.netProfit || 0), 0),
              )}
            </td>
            <td style={tdStyle("right")}>—</td>
            <td style={tdStyle("right")}>100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ProfitByCategoryTable;
