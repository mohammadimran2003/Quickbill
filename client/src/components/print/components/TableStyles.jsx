export const thStyle = (align = "left") => ({
  textAlign: align,
  padding: "7px 10px",
  fontWeight: 600,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "#555",
  backgroundColor: "#f5f5f5",
  borderBottom: "2px solid #e0e0e0",
});

export const tdStyle = (align = "left", extra = {}) => ({
  textAlign: align,
  padding: "7px 10px",
  fontSize: "12px",
  borderBottom: "1px solid #eee",
  ...extra,
});

export const thStyleSimple = (align = "left") => ({
  textAlign: align,
  padding: "8px 10px",
  fontWeight: 600,
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "#333",
  backgroundColor: "#f5f5f5",
  borderBottom: "2px solid #ccc",
});

export const tdStyleSimple = (align = "left", extra = {}) => ({
  textAlign: align,
  padding: "8px 10px",
  fontSize: "12px",
  borderBottom: "1px solid #e0e0e0",
  ...extra,
});
