import useFmt from "../../../hooks/useFmt";
import { thStyle, tdStyle } from "./TableStyles";

const ProfitTrendTable = ({ chartData }) => {
  const fmt = useFmt();

  if (!chartData || chartData.length === 0) return null;

  return (
    <div style={{ marginBottom: "28px", pageBreakInside: "avoid" }}>
      <h2
        style={{
          fontSize: "15px",
          margin: "0 0 12px",
          color: "#333",
          borderLeft: "4px solid #0284C7",
          paddingLeft: "10px",
        }}
      >
        Profit Trend Overview
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
            <th style={thStyle("left")}>Date</th>
            <th style={thStyle("right")}>Orders</th>
            <th style={thStyle("right")}>Revenue</th>
            <th style={thStyle("right")}>Cost</th>
            <th style={thStyle("right")}>Net Profit</th>
            <th style={thStyle("right")}>Margin %</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((row, i) => {
            const margin =
              row.revenue > 0
                ? ((row.profit / row.revenue) * 100).toFixed(1)
                : "0.0";
            const cost = (row.revenue || 0) - (row.profit || 0);
            return (
              <tr
                key={row.date || i}
                style={{
                  backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                }}
              >
                <td style={tdStyle("left", { fontWeight: 500 })}>{row.date}</td>
                <td style={tdStyle("right")}>{row.orders}</td>
                <td style={tdStyle("right")}>{fmt(row.revenue)}</td>
                <td style={tdStyle("right", { color: "#666" })}>{fmt(cost)}</td>
                <td
                  style={tdStyle("right", {
                    fontWeight: 700,
                    color: "#00A76F",
                  })}
                >
                  {fmt(row.profit)}
                </td>
                <td style={tdStyle("right")}>
                  <span
                    style={{
                      backgroundColor:
                        Number(margin) >= 20 ? "#E8F8F2" : "#FFF8E1",
                      color: Number(margin) >= 20 ? "#00A76F" : "#FFAB00",
                      padding: "2px 7px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {margin}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProfitTrendTable;
