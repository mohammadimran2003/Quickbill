import React from "react";
import { useQuery } from "@tanstack/react-query";
import getStore from "../../api/stores_api/getStore";

const ReportHeader = React.forwardRef(({ title, dateRange, showDateRange = true }, ref) => {
  const { data: storeData } = useQuery({
    queryKey: ["store"],
    queryFn: () => getStore(),
  });

  const { name, address, phone, currency } = storeData?.data || {};

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottom: "2px solid #222",
        paddingBottom: "14px",
        marginBottom: "24px",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 800,
            color: "#111",
          }}
        >
          {name || "Quickbill"}
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#666" }}>
          {title}
        </p>
        {address && (
          <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#888" }}>
            {address}
          </p>
        )}
        {phone && (
          <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#888" }}>
            Phone: {phone}
          </p>
        )}
      </div>
      {showDateRange && (
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "2px" }}>
            Period
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700 }}>
            {dateRange?.from || "—"} &nbsp;→&nbsp; {dateRange?.to || "—"}
          </div>
          <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>
            Generated: {new Date().toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
});

ReportHeader.displayName = "ReportHeader";

export default ReportHeader;
