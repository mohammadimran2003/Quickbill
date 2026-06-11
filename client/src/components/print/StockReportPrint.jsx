import React from "react";
import ReportHeader from "../shared/ReportHeader.jsx";
import ReportFooter from "../shared/ReportFooter.jsx";
import SummaryCard from "./components/SummaryCard.jsx";
import StockReportTable from "./components/StockReportTable.jsx";
import LowStockTable from "./components/LowStockTable.jsx";
import StockByCategoryTable from "./components/StockByCategoryTable.jsx";
import useFmt from "../../hooks/useFmt.js";

const StockReportPrint = React.forwardRef(
  (
    { summary, stockDetails, topLowStockProducts, stockByCategory, dateRange },
    ref,
  ) => {
    const fmt = useFmt();

    return (
      <div
        ref={ref}
        style={{
          padding: "32px",
          fontFamily: "system-ui, -apple-system, Arial, sans-serif",
          color: "#222",
          backgroundColor: "#fff",
          fontSize: "13px",
          lineHeight: 1.5,
        }}
      >
        {/* Header */}
        <ReportHeader title="Inventory Stock Report" dateRange={dateRange} />

        {/* Summary Statistics */}
        <div style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "15px",
              margin: "0 0 12px",
              color: "#111",
              fontWeight: 700,
            }}
          >
            Stock Summary
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
            }}
          >
            <SummaryCard
              label="Total Stock Value"
              value={fmt(summary?.totalStockValue)}
            />
            <SummaryCard
              label="Total Products"
              value={summary?.totalProducts ?? 0}
            />
            <SummaryCard
              label="Low Stock Products"
              value={summary?.lowStockItems ?? 0}
            />
            <SummaryCard
              label="Out of Stock Items"
              value={summary?.outOfStockItems ?? 0}
            />
          </div>
        </div>

        {/* Main Stock Report Table */}
        <div style={{ marginBottom: "28px", pageBreakInside: "avoid" }}>
          <h2
            style={{
              fontSize: "15px",
              margin: "0 0 12px",
              color: "#111",
              fontWeight: 700,
            }}
          >
            Stock Report Breakdown
          </h2>
          {!stockDetails || stockDetails.length === 0 ? (
            <p style={{ color: "#888", fontSize: "12px" }}>
              No stock data recorded for this period.
            </p>
          ) : (
            <StockReportTable stockDetails={stockDetails} />
          )}
        </div>

        {/* Two columns: Low Stock and Stock by Category */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            pageBreakInside: "avoid",
          }}
        >
          {/* Low Stock Products */}
          <div>
            <h2
              style={{
                fontSize: "15px",
                margin: "0 0 12px",
                color: "#111",
                fontWeight: 700,
              }}
            >
              Top Low Stock Alert
            </h2>
            <LowStockTable topLowStockProducts={topLowStockProducts} />
          </div>

          {/* Stock by Category */}
          <div>
            <h2
              style={{
                fontSize: "15px",
                margin: "0 0 12px",
                color: "#111",
                fontWeight: 700,
              }}
            >
              Stock by Category
            </h2>
            <StockByCategoryTable stockByCategory={stockByCategory} />
          </div>
        </div>

        {/* Footer */}
        <ReportFooter />
      </div>
    );
  },
);

StockReportPrint.displayName = "StockReportPrint";

export default StockReportPrint;
