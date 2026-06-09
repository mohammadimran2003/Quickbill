import useFmt from "../../../hooks/useFmt";
import { thStyle, tdStyle } from "./TableStyles";

const RANK_LABELS = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
];

const ProfitableProductsTable = ({ profitableProducts }) => {
  const fmt = useFmt();

  if (!profitableProducts || profitableProducts.length === 0) {
    return (
      <p style={{ color: "#888", fontSize: "12px" }}>
        No product data for this period.
      </p>
    );
  }

  return (
    <div style={{ marginBottom: "28px", pageBreakInside: "avoid" }}>
      <h2
        style={{
          fontSize: "15px",
          margin: "0 0 12px",
          color: "#333",
          borderLeft: "4px solid #FFAB00",
          paddingLeft: "10px",
        }}
      >
        Most Profitable Products (Top {profitableProducts.length})
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
            <th style={thStyle("center")}>#</th>
            <th style={thStyle("left")}>Product Name</th>
            <th style={thStyle("right")}>Qty Sold</th>
            <th style={thStyle("right")}>Revenue</th>
            <th style={thStyle("right")}>Cost</th>
            <th style={thStyle("right")}>Net Profit</th>
            <th style={thStyle("right")}>Margin %</th>
          </tr>
        </thead>
        <tbody>
          {profitableProducts.map((p, i) => (
            <tr
              key={p.productId || i}
              style={{
                backgroundColor:
                  i === 0 ? "#FFFDE7" : i % 2 === 0 ? "#fff" : "#fafafa",
              }}
            >
              <td style={tdStyle("center", { fontWeight: 700 })}>
                {RANK_LABELS[i] ?? `${i + 1}th`}
              </td>
              <td style={tdStyle("left", { fontWeight: i < 3 ? 700 : 500 })}>
                {p.name}
              </td>
              <td style={tdStyle("right")}>{fmt(p.quantitySold)}</td>
              <td style={tdStyle("right")}>{fmt(p.totalRevenue)}</td>
              <td style={tdStyle("right", { color: "#888" })}>
                {fmt(p.totalCost)}
              </td>
              <td
                style={tdStyle("right", {
                  fontWeight: 700,
                  color: "#00A76F",
                })}
              >
                {fmt(p.netProfit)}
              </td>
              <td style={tdStyle("right")}>
                <span
                  style={{
                    backgroundColor:
                      p.profitMargin >= 35
                        ? "#E8F8F2"
                        : p.profitMargin >= 20
                          ? "#E3F2FD"
                          : p.profitMargin >= 10
                            ? "#FFF8E1"
                            : "#FFEBEE",
                    color:
                      p.profitMargin >= 35
                        ? "#00A76F"
                        : p.profitMargin >= 20
                          ? "#0284C7"
                          : p.profitMargin >= 10
                            ? "#FFAB00"
                            : "#B71D2B",
                    padding: "2px 7px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {fmt(p.profitMargin)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfitableProductsTable;
