import useFmt from "../../../hooks/useFmt.js";

const SalesOverviewTable = ({ chartData }) => {
  const fmt = useFmt();
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "12px",
      }}
    >
      <thead>
        <tr
          style={{
            backgroundColor: "#f1f1f1",
            borderBottom: "2px solid #ddd",
          }}
        >
          <th
            style={{
              textAlign: "left",
              padding: "8px",
              fontWeight: 600,
            }}
          >
            Date
          </th>
          <th
            style={{
              textAlign: "right",
              padding: "8px",
              fontWeight: 600,
            }}
          >
            Orders
          </th>
          <th
            style={{
              textAlign: "right",
              padding: "8px",
              fontWeight: 600,
            }}
          >
            Revenue
          </th>
          <th
            style={{
              textAlign: "right",
              padding: "8px",
              fontWeight: 600,
            }}
          >
            Profit
          </th>
          <th
            style={{
              textAlign: "right",
              padding: "8px",
              fontWeight: 600,
            }}
          >
            Cash
          </th>
          <th
            style={{
              textAlign: "right",
              padding: "8px",
              fontWeight: 600,
            }}
          >
            Card
          </th>
          <th
            style={{
              textAlign: "right",
              padding: "8px",
              fontWeight: 600,
            }}
          >
            Mobile Banking
          </th>
        </tr>
      </thead>
      <tbody>
        {chartData.length === 0 ? (
          <tr>
            <td
              colSpan={7}
              style={{
                textAlign: "center",
                padding: "15px",
                color: "#888",
              }}
            >
              No data available
            </td>
          </tr>
        ) : (
          chartData.map((row, i) => (
            <tr
              key={row.date}
              style={{
                borderBottom: "1px solid #eee",
                backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
              }}
            >
              <td style={{ padding: "8px" }}>{row.date}</td>
              <td style={{ textAlign: "right", padding: "8px" }}>
                {row.orders}
              </td>
              <td style={{ textAlign: "right", padding: "8px" }}>
                {fmt(row.revenue)}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "8px",
                  color: "text.primary",
                  fontWeight: 600,
                }}
              >
                {fmt(row.profit)}
              </td>
              <td style={{ textAlign: "right", padding: "8px" }}>
                {fmt(row.paymentBreakdown?.CASH || 0)}
              </td>
              <td style={{ textAlign: "right", padding: "8px" }}>
                {fmt(row.paymentBreakdown?.CARD || 0)}
              </td>
              <td style={{ textAlign: "right", padding: "8px" }}>
                {fmt(row.paymentBreakdown?.MOBILE_BANKING || 0)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default SalesOverviewTable;
