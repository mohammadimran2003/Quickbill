import fmt from "../../../utils/fmt";

const TopProductsTable = ({ products }) => {
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
            borderBottom: "1px solid #ddd",
          }}
        >
          <th
            style={{
              textAlign: "left",
              padding: "8px",
              fontWeight: 600,
            }}
          >
            Product Name
          </th>
          <th
            style={{
              textAlign: "right",
              padding: "8px",
              fontWeight: 600,
            }}
          >
            Qty
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
        </tr>
      </thead>
      <tbody>
        {!products || products.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              style={{
                textAlign: "center",
                padding: "15px",
                color: "#888",
              }}
            >
              No products recorded
            </td>
          </tr>
        ) : (
          products.map((row, i) => (
            <tr
              key={row.productId || i}
              style={{
                borderBottom: "1px solid #eee",
                backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
              }}
            >
              <td style={{ padding: "8px", fontWeight: 500 }}>{row.name}</td>
              <td style={{ textAlign: "right", padding: "8px" }}>
                {row.quantity}
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
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default TopProductsTable;
