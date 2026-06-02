import React, { useState } from "react";
import { Box, Typography, Paper, Tabs, Tab } from "@mui/material";
import SalesOverviewChart from "./SalesOverviewChart";
import YearlyOverview from "./YearlyOverView";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ChartMenu = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Sales & Purchase Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View sales and purchase data
          </Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="chart tabs">
            <Tab label="Last 30 days Sales" {...a11yProps(0)} />
            <Tab label="Yearly Overview" {...a11yProps(1)} />
          </Tabs>
        </Box>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <SalesOverviewChart />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <YearlyOverview />
      </CustomTabPanel>
    </Paper>
  );
};

export default ChartMenu;
