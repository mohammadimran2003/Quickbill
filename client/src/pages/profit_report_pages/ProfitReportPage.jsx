import { useState, useEffect, useRef, Suspense } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import DateRangeFilter from "../../components/shared/DateRangeFilter.jsx";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProfitReport } from "../../api/reports_api/getProfitReports.js";
import ProfitVsRevenueChart from "../../components/charts/ProfitVsRevenueChart.jsx";
import MostProfitableProducts from "../../components/profits_report_comp/MostProfitableProducts.jsx";
import ProfitReportPrint from "../../components/print/ProfitReportPrint.jsx";
import ProfitByCategoryChart from "../../components/charts/ProfitByCategoryChart.jsx";
import PrintBtn from "../../components/shared/PrintBtn.jsx";
import ProfitsStats from "../../components/profits_report_comp/ProfitsStats.jsx";
import StatsSkeleton from "../../components/shared/skeletons/StatsSkeleton.jsx";

function ProfitReportPage() {
  const [groupBy, setGroupBy] = useState("daily");
  const [searchParams, setSearchParams] = useSearchParams();
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Profit_Report_${searchParams.get("from") || "start"}_to_${searchParams.get("to") || "end"}`,
    onPrintError: () => {
      console.error("Failed to print");
    },
  });

  useEffect(() => {
    if (!searchParams.get("from")) {
      setSearchParams({
        from: dayjs().startOf("month").format("YYYY-MM-DD"),
        to: dayjs().format("YYYY-MM-DD"),
        groupBy: "daily",
      });
    }
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profit-report", searchParams.toString()],
    queryFn: () => getProfitReport(searchParams),
    enabled: !!searchParams.get("from"),
  });

  const handleFilterChange = (dateRange) => {
    setGroupBy(dateRange.groupBy);

    setSearchParams({
      from: dateRange.startDate,
      to: dateRange.endDate,
      groupBy: dateRange.groupBy,
    });
  };

  const summary = data?.data?.summary || {};
  const chartData = data?.data?.chartData || [];
  const profitableProducts = data?.data?.profitableProducts || [];
  const profitByCategory = data?.data?.profitByCategory || [];

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Error loading profit report: {error?.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, color: "text.primary" }}>
      {/* Hidden Print Template */}
      <div style={{ display: "none" }}>
        <ProfitReportPrint
          ref={contentRef}
          summary={summary}
          chartData={chartData}
          profitableProducts={profitableProducts}
          profitByCategory={profitByCategory}
          dateRange={{
            from: searchParams.get("from"),
            to: searchParams.get("to"),
          }}
        />
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Profit Report</Typography>
        <PrintBtn onHandlePrint={handlePrint} />
      </Box>
      {/* Filter */}
      <Box sx={{ mb: 3 }}>
        <DateRangeFilter onFilterChange={handleFilterChange} />
      </Box>

      <Suspense fallback={<StatsSkeleton />}>
        <ProfitsStats summary={summary} isLoading={isLoading} />
      </Suspense>

      {/* Profit vs Revenue Trend Chart */}
      <Box sx={{ mt: 4 }}>
        <ProfitVsRevenueChart
          data={chartData}
          groupBy={groupBy}
          isLoading={isLoading}
        />
      </Box>

      {/* Most Profitable Products Table + Profit by Category Chart */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid size={8}>
          <MostProfitableProducts
            products={profitableProducts}
            isLoading={isLoading}
          />
        </Grid>
        <Grid size={4}>
          <ProfitByCategoryChart
            data={profitByCategory}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfitReportPage;
