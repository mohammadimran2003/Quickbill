import useFmt from "../../../hooks/useFmt.js";

const TopCustomersTable = ({ customers }) => {
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
            Customer Name
          </th>
          <th
            style={{
              textAlign: "center",
              padding: "8px",
              fontWeight: 600,
            }}
          >
            Phone
          </th>
          <th
            style={{
              textAlign: "center",
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
            Spent
          </th>
        </tr>
      </thead>
      <tbody>
        {!customers || customers.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              style={{
                textAlign: "center",
                padding: "15px",
                color: "#888",
              }}
            >
              No customers recorded
            </td>
          </tr>
        ) : (
          customers.map((row, i) => (
            <tr
              key={row.customerId || i}
              style={{
                borderBottom: "1px solid #eee",
                backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
              }}
            >
              <td style={{ padding: "8px", fontWeight: 500 }}>{row.name}</td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                {row.phone || "N/A"}
              </td>
              <td style={{ textAlign: "center", padding: "8px" }}>
                {row.orders}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "8px",
                  fontWeight: 600,
                }}
              >
                {fmt(row.totalSpent)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default TopCustomersTable;
