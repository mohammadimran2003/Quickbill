import { useState, useEffect, useRef, Suspense } from "react";
import SalesReportChart from "../../components/sales_report_comp/SalesReportChart.jsx";
import { Box, Grid, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSalesReport } from "../../api/reports_api/getSalesReports.js";
import dayjs from "dayjs";
import DataTable from "../../components/sales_report_comp/DataTable.jsx";
import TopProductsTable from "../../components/sales_report_comp/TopProductsTable.jsx";
import TopCustomersTable from "../../components/sales_report_comp/TopCustomersTable.jsx";
import { useReactToPrint } from "react-to-print";
import SalesReportPrint from "../../components/print/SalesReportPrint.jsx";
import DateRangeFilter from "../../components/shared/DateRangeFilter.jsx";
import PrintBtn from "../../components/shared/PrintBtn.jsx";
import SalesStats from "../../components/sales_report_comp/SalesStats.jsx";
import StatsSkeleton from "../../components/shared/skeletons/StatsSkeleton.jsx";

function SalesReportPage() {
  const [groupBy, setGroupBy] = useState("daily");
  const [searchParams, setSearchParams] = useSearchParams();
  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `Sales_Report_${searchParams.get("from") || "start"}_to_${searchParams.get("to") || "end"}`,
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
    queryKey: ["sales-report", searchParams.toString()],
    queryFn: () => getSalesReport(searchParams),
    enabled: !!searchParams.get("from"),
  });

  const summary = data?.data?.summary ?? null;
  const chartData = data?.data?.chartData ?? [];
  const products = data?.data?.products ?? [];
  const customers = data?.data?.customers ?? [];

  const handleFilterChange = (dateRange) => {
    setGroupBy(dateRange.groupBy);

    setSearchParams({
      from: dateRange.startDate,
      to: dateRange.endDate,
      groupBy: dateRange.groupBy,
    });
  };

  if (isError && error?.response?.status === 404) {
    return (
      <Box sx={{ p: 3, color: "text.primary" }}>
        <Typography variant="h6">No data found</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4, color: "text.primary" }}>
        <Typography variant="h6">Error: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, color: "text.primary" }}>
      {/* Hidden Print Template */}
      <div style={{ display: "none" }}>
        <SalesReportPrint
          ref={contentRef}
          summary={summary}
          chartData={chartData}
          products={products}
          customers={customers}
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
        <Typography variant="h4">Sales Report</Typography>
        <PrintBtn onHandlePrint={handlePrint} />
      </Box>

      {/* Filter */}
      <Box sx={{ mb: 3 }}>
        <DateRangeFilter onFilterChange={handleFilterChange} />
      </Box>

      {/* Stat Cards */}
      <Suspense fallback={<StatsSkeleton />}>
        <SalesStats summary={summary} isLoading={isLoading} />
      </Suspense>
      <SalesReportChart
        data={chartData}
        groupBy={groupBy}
        isLoading={isLoading}
      />

      {/* Data Table */}
      <DataTable chartData={chartData} isLoading={isLoading} />

      {/* Top Products & Top Customers */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={6}>
          <TopProductsTable products={products} isLoading={isLoading} />
        </Grid>
        <Grid size={6}>
          <TopCustomersTable customers={customers} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default SalesReportPage;
