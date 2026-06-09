import useFmt from "../../../hooks/useFmt";

const SalesSummaryCards = ({ summary }) => {
  const fmt = useFmt();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "15px",
      }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          padding: "12px",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            color: "#666",
          }}
        >
          Total Revenue
        </span>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginTop: "5px",
            color: "text.primary",
          }}
        >
          {fmt(summary?.totalRevenue)}
        </div>
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "12px",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            color: "#666",
          }}
        >
          Total Orders
        </span>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          {summary?.totalOrders ?? 0}
        </div>
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "12px",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            color: "#666",
          }}
        >
          Total Profit
        </span>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginTop: "5px",
            color: "text.secondary",
          }}
        >
          {fmt(summary?.totalProfit)}
        </div>
      </div>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "12px",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            color: "#666",
          }}
        >
          Avg Order Value
        </span>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginTop: "5px",
          }}
        >
          {fmt(summary?.avgOrderValue?.toFixed(2))}
        </div>
      </div>
    </div>
  );
};

export default SalesSummaryCards;
