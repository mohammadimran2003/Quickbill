import { useState, useEffect, useRef } from "react";
import SalesReportChart from "../../components/sales_report_comp/SalesReportChart";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import StatCard from "../../components/shared/StatCard";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSalesReport } from "../../api/reports_api/getSalesReports";
import dayjs from "dayjs";
import fmt from "../../utils/fmt";
import DataTable from "../../components/sales_report_comp/DataTable";
import TopProductsTable from "../../components/sales_report_comp/TopProductsTable";
import TopCustomersTable from "../../components/sales_report_comp/TopCustomersTable";
import PrintIcon from "@mui/icons-material/Print";
import { useReactToPrint } from "react-to-print";
import SalesReportPrint from "../../components/print/SalesReportPrint";
import DateRangeFilter from "../../components/shared/DateRangeFilter";
import PrintBtn from "../../components/shared/PrintBtn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SalesStats from "../../components/sales_report_comp/SalesStats";

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
      <SalesStats summary={summary} isLoading={isLoading} />

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
