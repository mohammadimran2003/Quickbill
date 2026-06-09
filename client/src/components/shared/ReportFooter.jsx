import React from "react";
import { useQuery } from "@tanstack/react-query";
import getStore from "../../api/stores_api/getStore";

const ReportFooter = React.forwardRef(({ showCurrency = true }, ref) => {
  const { data: storeData } = useQuery({
    queryKey: ["store"],
    queryFn: () => getStore(),
  });

  const { receiptFooter, binNumber, currency } = storeData?.data || {};

  const currencySymbol = currency?.symbol || currency || "৳";
  const currencyCode = currency?.code || (currency === "৳" ? "BDT" : currency);

  return (
    <div
      ref={ref}
      style={{
        marginTop: "48px",
        borderTop: "1px solid #eee",
        paddingTop: "12px",
        textAlign: "center",
        fontSize: "11px",
        color: "#aaa",
      }}
    >
      {receiptFooter && (
        <div style={{ marginBottom: "4px" }}>{receiptFooter}</div>
      )}
      {binNumber && <div style={{ marginBottom: "4px" }}>BIN: {binNumber}</div>}
      <div>
        Report generated automatically by{" "}
        <strong style={{ color: "#555" }}>Quickbill Billing System</strong>
        {showCurrency && currency && (
          <span>
            {" "}
            &nbsp;·&nbsp; All monetary values are in {currencySymbol} (
            {currencyCode})
          </span>
        )}{" "}
        &nbsp;·&nbsp; {new Date().toLocaleString()}
      </div>
    </div>
  );
});

ReportFooter.displayName = "ReportFooter";

export default ReportFooter;
