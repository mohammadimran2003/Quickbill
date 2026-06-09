import { Box, Grid, Typography } from "@mui/material";

import DateRangeFilter from "../../components/shared/DateRangeFilter";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef, Suspense } from "react";
import { useReactToPrint } from "react-to-print";
import dayjs from "dayjs";
import getStockReports from "../../api/reports_api/getStockReports";
import StockReportTable from "../../components/stocks_report_comp/StockReportTable";
import TopLowStockTable from "../../components/stocks_report_comp/TopLowStockTable";
import StockByCategoryChart from "../../components/charts/StockByCategoryChart";
import StockReportPrint from "../../components/print/StockReportPrint";
import PrintBtn from "../../components/shared/PrintBtn";
import StockReportStats from "../../components/stocks_report_comp/StockReportStats";
import StatsSkeleton from "../../components/shared/skeletons/StatsSkeleton";

function StockReportPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Stock_Report_${searchParams.get("from") || "start"}_to_${searchParams.get("to") || "end"}`,
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
    queryKey: ["stock-report", searchParams.toString()],
    queryFn: () => getStockReports(searchParams),
  });
  const handleFilterChange = async (filters) => {
    setSearchParams({
      from: filters.startDate,
      to: filters.endDate,
      groupBy: filters.groupBy,
    });
  };

  const { summary } = data?.data || {};

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, color: "text.primary" }}>
      {/* Hidden Print Template */}
      <div style={{ display: "none" }}>
        <StockReportPrint
          ref={contentRef}
          summary={summary}
          stockDetails={data?.data?.stockDetails}
          topLowStockProducts={data?.data?.topLowStockProducts}
          stockByCategory={data?.data?.stockByCategory}
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
          mb: 4,
        }}
      >
        <Typography variant="h6">Stock Report</Typography>
        <PrintBtn onHandlePrint={handlePrint} />
      </Box>
      <Box sx={{ mb: 3 }}>
        <DateRangeFilter onFilterChange={handleFilterChange} />
      </Box>

      <Suspense fallback={<StatsSkeleton />}>
        <StockReportStats summary={summary} isLoading={isLoading} />
      </Suspense>

      <StockReportTable stockDetails={data?.data?.stockDetails} />

      <Grid container spacing={3} sx={{ mt: 3, alignItems: "flex-start" }}>
        <Grid size={6}>
          <TopLowStockTable
            topLowStockProducts={data?.data?.topLowStockProducts}
            isLoading={isLoading}
          />
        </Grid>
        <Grid size={6}>
          <StockByCategoryChart
            stockByCategory={data?.data?.stockByCategory}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default StockReportPage;
