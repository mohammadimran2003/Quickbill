import { createTheme } from "@mui/material/styles";

const getTheme = (mode) =>
  createTheme({
    palette: {
      mode, // 'light' or 'dark' based on the mode

      // 🟢 PRIMARY (mint green - brand color in both modes)
      primary: {
        main: "#00A76F",
        dark: "#007867",
        darker: "#004B50",
        contrastText: "#FFFFFF",
      },

      // ⚪ SECONDARY
      secondary: {
        main: mode === "light" ? "#dbdada" : "#919EAB",
      },

      // ✅ SUCCESS
      success: {
        main: "#00A76F",
      },

      // ⚠️ WARNING
      warning: {
        main: "#FFAB00",
        contrastText: "#1C252E", // yellow text on dark mode
      },

      // 🚨 ERROR
      error: {
        main: mode === "light" ? "#B71D2B" : "#FF5630",
      },

      // 📝 TEXT COLORS
      text: {
        primary: mode === "light" ? "#1C252E" : "#FFFFFF",
        secondary: mode === "light" ? "#637381" : "#919EAB",
      },

      background: {
        default: mode === "light" ? "#F9FAFB" : "#161C24", // main body background
        paper: mode === "light" ? "#FFFFFF" : "#212B36", // card, table, sidebar background

        neutral: mode === "light" ? "#F4F6F8" : "#28323D",
      },

      // Custom colors
      statCard: {
        sales: {
          color: mode === "light" ? "#00A76F" : "#00D68F",
          bg: mode === "light" ? "#E8F8F2" : "rgba(0,167,111,0.16)",
        },
        orders: {
          color: mode === "light" ? "#1565C0" : "#4FC3F7",
          bg: mode === "light" ? "#E3F2FD" : "rgba(21,101,192,0.16)",
        },
        profit: {
          color: mode === "light" ? "#FFAB00" : "#FFD740",
          bg: mode === "light" ? "#FFF8E1" : "rgba(255,171,0,0.16)",
        },
        revenue: {
          color: mode === "light" ? "#B71D2B" : "#FF6B6B",
          bg: mode === "light" ? "#FFEBEE" : "rgba(183,29,43,0.16)",
        },
        expense: {
          color: mode === "light" ? "#B71D2B" : "#FF6B6B",
          bg: mode === "light" ? "#FFEBEE" : "rgba(183,29,43,0.16)",
        },
        expenseThisMonth: {
          color: mode === "light" ? "#1565C0" : "#4FC3F7",
          bg: mode === "light" ? "#E3F2FD" : "rgba(21,101,192,0.16)",
        },
        expenseByCategory: {
          color: mode === "light" ? "#FFAB00" : "#FFD740",
          bg: mode === "light" ? "#FFF8E1" : "rgba(255,171,0,0.16)",
        },
        expenseAllTime: {
          color: mode === "light" ? "#B71D2B" : "#FF6B6B",
          bg: mode === "light" ? "#FFEBEE" : "rgba(183,29,43,0.16)",
        },
        avgOrderValue: {
          color: mode === "light" ? "#B71D2B" : "#FF6B6B",
          bg: mode === "light" ? "#FFEBEE" : "rgba(183,29,43,0.16)",
        },
        cost: {
          color: mode === "light" ? "#B71D2B" : "#FF6B6B",
          bg: mode === "light" ? "#FFEBEE" : "rgba(183,29,43,0.16)",
        },
        positive: {
          color: mode === "light" ? "#00A76F" : "#00D68F",
          bg: mode === "light" ? "#E8F8F2" : "rgba(0,167,111,0.16)",
        },
        negative: {
          color: mode === "light" ? "#B71D2B" : "#FF6B6B",
          bg: mode === "light" ? "#FFEBEE" : "rgba(183,29,43,0.16)",
        },
        warning: {
          color: mode === "light" ? "#FFAB00" : "#FFD740",
          bg: mode === "light" ? "#FFF8E1" : "rgba(255,171,0,0.16)",
        },
      },
    },
  });

export default getTheme;
