import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Stack,
} from "@mui/material";

const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <Paper
      sx={{
        mt: 2,
        p: 4,
        borderRadius: 4,
        overflowX: "auto",
      }}
    >
      {/* Filter Section Skeleton */}
      <Box sx={{ mb: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
        >
          <Skeleton
            variant="rectangular"
            height={20}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            width={150}
            height={40}
            sx={{ borderRadius: 2 }}
          />
        </Stack>
      </Box>

      {/* Table Skeleton */}
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "background.neutral" }}>
            <TableRow>
              {Array.from({ length: cols }).map((_, i) => (
                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                  <Skeleton variant="text" width="60%" height={24} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              "& tr:last-child td": {
                borderBottom: 0,
              },
            }}
          >
            {Array.from({ length: rows }).map((_, rIndex) => (
              <TableRow key={rIndex}>
                {Array.from({ length: cols }).map((_, cIndex) => (
                  <TableCell key={cIndex}>
                    <Skeleton
                      variant="rectangular"
                      height={cIndex === 0 ? 24 : 32}
                      width={cIndex === 0 ? "100%" : "80%"}
                      sx={{ borderRadius: 2 }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination Skeleton */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Skeleton variant="text" width={100} height={32} />
          <Skeleton
            variant="rectangular"
            width={120}
            height={32}
            sx={{ borderRadius: 2 }}
          />
        </Stack>
      </Box>
    </Paper>
  );
};

export default TableSkeleton;
