import React from "react";

const SummaryCard = ({ label, value, sub, accentColor }) => (
  <div
    style={{
      border: `1px solid ${accentColor}55`,
      borderLeft: `4px solid ${accentColor}`,
      borderRadius: "6px",
      padding: "12px 16px",
      backgroundColor: `${accentColor}08`,
    }}
  >
    <div
      style={{
        fontSize: "10px",
        textTransform: "uppercase",
        color: "#777",
        letterSpacing: "0.6px",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: "20px",
        fontWeight: 700,
        marginTop: "4px",
        color: "#1a1a1a",
      }}
    >
      {value}
    </div>
    {sub && (
      <div
        style={{
          fontSize: "11px",
          color: accentColor,
          marginTop: "3px",
          fontWeight: 600,
        }}
      >
        {sub}
      </div>
    )}
  </div>
);

export default SummaryCard;
