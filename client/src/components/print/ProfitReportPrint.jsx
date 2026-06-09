import React from "react";
import ReportHeader from "../shared/ReportHeader";
import ReportFooter from "../shared/ReportFooter";
import SummaryCard from "./components/SummaryCard";
import ProfitTrendTable from "./components/ProfitTrendTable";
import ProfitableProductsTable from "./components/ProfitableProductsTable";
import ProfitByCategoryTable from "./components/ProfitByCategoryTable";
import useFmt from "../../hooks/useFmt";

// ─── Main Component ────────────────────────────────────────────────────────────

const ProfitReportPrint = React.forwardRef(
  (
    { summary, chartData, profitableProducts, profitByCategory, dateRange },
    ref,
  ) => {
    const fmt = useFmt();

    const totalRevenue = summary?.totalRevenue || 0;
    const totalProfit = summary?.totalProfit || 0;
    const totalCostPrice = summary?.totalCostPrice || 0;

    const profitMargin =
      totalRevenue > 0
        ? ((totalProfit / totalRevenue) * 100).toFixed(1)
        : "0.0";
    const markupPct =
      totalCostPrice > 0
        ? ((totalProfit / totalCostPrice) * 100).toFixed(1)
        : "0.0";

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
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <ReportHeader
          title="Profit & Margin Analysis Report"
          dateRange={dateRange}
        />

        {/* ── Summary Cards ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "15px",
              margin: "0 0 12px",
              color: "#333",
              borderLeft: "4px solid #00A76F",
              paddingLeft: "10px",
            }}
          >
            Summary
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
            }}
          >
            <SummaryCard
              label="Total Revenue"
              value={fmt(totalRevenue)}
              accentColor="#00A76F"
            />
            <SummaryCard
              label="Total Orders"
              value={summary?.totalOrders ?? "—"}
              accentColor="#1565C0"
            />
            <SummaryCard
              label="Total Profit"
              value={fmt(totalProfit)}
              sub={`${profitMargin}% Gross Margin`}
              accentColor="#FFAB00"
            />
            <SummaryCard
              label="Total Cost (COGS)"
              value={fmt(totalCostPrice)}
              sub={`${markupPct}% Markup`}
              accentColor="#B71D2B"
            />
          </div>
        </div>

        {/* ── Profit Trend Table ──────────────────────────────────────────── */}
        <ProfitTrendTable chartData={chartData} />

        {/* ── Most Profitable Products ─────────────────────────────────────── */}
        <ProfitableProductsTable profitableProducts={profitableProducts} />

        {/* ── Profit by Category ───────────────────────────────────────────── */}
        <ProfitByCategoryTable profitByCategory={profitByCategory} />

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <ReportFooter />
      </div>
    );
  },
);

ProfitReportPrint.displayName = "ProfitReportPrint";

export default ProfitReportPrint;
