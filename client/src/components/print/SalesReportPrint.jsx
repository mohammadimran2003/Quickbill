import React from "react";

import ReportHeader from "../shared/ReportHeader.jsx";
import ReportFooter from "../shared/ReportFooter.jsx";
import SalesSummaryCards from "./components/SalesSummaryCards.jsx";
import SalesOverviewTable from "./components/SalesOverviewTable.jsx";
import TopProductsTable from "./components/TopProductsTable.jsx";
import TopCustomersTable from "./components/TopCustomersTable.jsx";

const SalesReportPrint = React.forwardRef(
  ({ summary, chartData, products, customers, dateRange }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          padding: "30px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#333",
          backgroundColor: "#fff",
        }}
      >
        {/* Report Header */}
        <ReportHeader
          title="Sales & Revenue Analysis Report"
          dateRange={dateRange}
        />

        {/* Summary Statistics */}
        <div style={{ marginBottom: "30px" }}>
          <h2
            style={{
              fontSize: "18px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "8px",
              marginBottom: "15px",
            }}
          >
            Summary
          </h2>
          <SalesSummaryCards summary={summary} />
        </div>

        {/* Sales Overview / Grouped Details */}
        <div style={{ marginBottom: "30px", pageBreakAfter: "auto" }}>
          <h2
            style={{
              fontSize: "18px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "8px",
              marginBottom: "15px",
            }}
          >
            Sales Overview
          </h2>
          <SalesOverviewTable chartData={chartData} />
        </div>

        {/* Top Products and Top Customers section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px",
            marginTop: "20px",
            pageBreakInside: "avoid",
          }}
        >
          {/* Top Selling Products */}
          <div>
            <h2
              style={{
                fontSize: "16px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                marginBottom: "15px",
              }}
            >
              Top Selling Products
            </h2>
            <TopProductsTable products={products} />
          </div>

          {/* Top Customers */}
          <div>
            <h2
              style={{
                fontSize: "16px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "8px",
                marginBottom: "15px",
              }}
            >
              Top Customers
            </h2>
            <TopCustomersTable customers={customers} />
          </div>
        </div>

        {/* Footer */}
        <ReportFooter />
      </div>
    );
  },
);

SalesReportPrint.displayName = "SalesReportPrint";

export default SalesReportPrint;
