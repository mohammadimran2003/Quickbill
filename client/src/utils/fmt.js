const fmt = (val) => (val != null ? `৳ ${Number(val).toLocaleString()}` : '—');

export default fmt;
