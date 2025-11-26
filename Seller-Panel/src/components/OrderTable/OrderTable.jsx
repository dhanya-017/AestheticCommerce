import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
  Avatar,
  Collapse,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerOrders, reset } from "../../Redux/dashboardSlice";

const headCells = [
  { id: "expand", label: "", numeric: false },
  { id: "orderId", label: "Order ID", numeric: false },
  { id: "paymentId", label: "Payment ID", numeric: false },
  { id: "customer", label: "Customer", numeric: false },
  { id: "phone", label: "Phone", numeric: false },
  { id: "address", label: "Address", numeric: false },
  { id: "products", label: "Products", numeric: false },
  { id: "amount", label: "Amount", numeric: true },
  { id: "status", label: "Status", numeric: false },
  { id: "date", label: "Date", numeric: false },
];

// Sorting helpers
const descendingComparator = (a, b, orderBy) =>
  b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;

const getComparator = (order, orderBy) =>
  order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

// Table Head
const EnhancedTableHead = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = (property) => (event) => onRequestSort(event, property);

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: "#e6fdf8", borderBottom: "2px solid #18a893" }}>
        {headCells.map(({ id, label, numeric }) => (
          <TableCell
            key={id}
            align={numeric ? "right" : "left"}
            sortDirection={orderBy === id ? order : false}
            sx={{
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#1a1a1a",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              padding: "14px 10px",
            }}
          >
            {id !== "expand" && id !== "products" ? (
              <TableSortLabel
                active={orderBy === id}
                direction={orderBy === id ? order : "asc"}
                onClick={createSortHandler(id)}
                hideSortIcon={orderBy !== id}
                sx={{
                  fontWeight: 700,
                  color: orderBy === id ? "#20BFA5" : "#1a1a1a",
                  "&:hover": { color: "#1aa38f" },
                  "&.Mui-active": { color: "#20BFA5" },
                  "& .MuiTableSortLabel-icon": {
                    opacity: orderBy === id ? 1 : 0,
                    color: "#20BFA5",
                  },
                }}
              >
                {label}
                {orderBy === id && (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                )}
              </TableSortLabel>
            ) : (
              label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

// Status color mapping
const getStatusColor = (status) => {
  switch (status) {
    case "Processing":
      return "info";
    case "Shipped":
      return "primary";
    case "Out for Delivery":
      return "warning";
    case "Delivered":
      return "success";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

// Toolbar with filters
const EnhancedTableToolbar = ({ filters, setFilters }) => {
  const handleFilterChange = (field) => (event) =>
    setFilters((prev) => ({ ...prev, [field]: event.target.value }));

  const statusOptions = [
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  const textFieldSx = {
    minWidth: 140,
    backgroundColor: "#fff",
    borderRadius: "6px",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      "&:hover fieldset": { borderColor: "#20BFA5" },
      "&.Mui-focused fieldset": { borderColor: "#20BFA5" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#20BFA5" },
  };

  return (
    <Toolbar
      sx={{
        pl: 2,
        pr: 1,
        flexWrap: "wrap",
        gap: 2,
        padding: "16px 24px",
        borderBottom: "2px solid #18a893",
        backgroundColor: "#e6fdf8",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          flex: "1 1 100%",
          fontWeight: 700,
          color: "#1a1a1a",
          fontSize: "1.25rem",
          letterSpacing: "-0.02em",
        }}
      >
        Recent Orders
      </Typography>

      <TextField
        size="small"
        select
        label="Status"
        value={filters.status}
        onChange={handleFilterChange("status")}
        sx={textFieldSx}
        SelectProps={{
          MenuProps: {
            disablePortal: true,
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root": {
                  "&:hover": { backgroundColor: "#e6fdf8" },
                  "&.Mui-selected": {
                    backgroundColor: "#20BFA5 !important",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#1aa38f !important" },
                  },
                },
              },
            },
          },
        }}
      >
        <MenuItem value="">All</MenuItem>
        {statusOptions.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        label="Search"
        value={filters.search}
        onChange={handleFilterChange("search")}
        placeholder="Search Order ID, Name, Email"
        sx={{ minWidth: 200, ...textFieldSx }}
      />
    </Toolbar>
  );
};

// Main OrderTable
const OrderTable = () => {
  const dispatch = useDispatch();
  const { orders = [], isLoading, isError, message } = useSelector(
    (state) => state.dashboard || {}
  );
  const authState = useSelector((state) => state.auth || {});
  const seller = authState?.seller ?? JSON.parse(localStorage.getItem("sellerData"));
  const token = authState?.token ?? localStorage.getItem("sellerToken");
  const sellerId = seller?._id || seller?.sellerId || seller?.id;

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openRow, setOpenRow] = useState(null);
  const [filters, setFilters] = useState({ status: "", search: "" });

  useEffect(() => {
    if (sellerId && token) {
      dispatch(fetchSellerOrders({ sellerId, token }));
      return () => dispatch(reset());
    }
  }, [dispatch, sellerId, token]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const transformedOrders = orders.map((order) => {
    const products = order.products || [];
    const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
    return {
      _id: order._id,
      orderId: order.orderId || order._id,
      paymentId: order.paymentId || "N/A",
      customer: order.user?.name || "N/A",
      email: order.user?.email || "N/A",
      phone: order.user?.phone || "N/A",
      address: order.shippingAddress?.street || order.shippingAddress?.address || "N/A",
      pincode: order.shippingAddress?.pincode || "N/A",
      products,
      quantity: totalQuantity,
      amount: order.totalPrice || 0,
      status: order.status
        ? order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()
        : "Processing",
      date: new Date(order.createdAt).getTime(),
      createdAt: order.createdAt,
    };
  });

  const filteredRows = useMemo(
    () =>
      transformedOrders.filter((row) => {
        const matchesStatus =
          filters.status === "" ||
          row.status?.toLowerCase() === filters.status.toLowerCase();
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          filters.search === "" ||
          row.orderId.toLowerCase().includes(searchLower) ||
          row.customer.toLowerCase().includes(searchLower) ||
          row.email.toLowerCase().includes(searchLower);
        return matchesStatus && matchesSearch;
      }),
    [transformedOrders, filters]
  );

  const visibleRows = useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy || "date"))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress sx={{ color: "#20BFA5" }} />
      </Box>
    );

  if (isError)
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" sx={{ fontWeight: 600 }}>
          Failed to load orders: {message}
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: "12px",
          boxShadow: "0 4px 7px rgba(32, 191, 165, 0.2)",
          border: "1px solid #20BFA5",
          overflow: "hidden",
        }}
      >
        <EnhancedTableToolbar filters={filters} setFilters={setFilters} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size="medium">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6, color: "#666" }}>
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, index) => (
                  <React.Fragment key={row._id}>
                    <TableRow
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "#e6fdf8 !important",
                          transition: "background-color 0.2s ease",
                        },
                      }}
                    >
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => setOpenRow(openRow === index ? null : index)}
                          sx={{ color: "#20BFA5", "&:hover": { color: "#1aa38f" } }}
                        >
                          {openRow === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: "#20BFA5" }}>
                          {row.orderId}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.paymentId}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{row.customer}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>
                        <Typography noWrap sx={{ maxWidth: 150 }}>{row.address}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.pincode}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          {row.products.slice(0, 3).map((item, idx) => (
                            <Avatar
                              key={idx}
                              src={item.product?.images?.[0] || ""}
                              variant="square"
                              sx={{ width: 40, height: 40, border: "2px solid #f0f0f0" }}
                            />
                          ))}
                          {row.products.length > 3 && (
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "grey.200",
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="caption" fontWeight={600}>
                                +{row.products.length - 3}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#20BFA5", fontWeight: 700 }}>
                        ₹{row.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip label={row.status} color={getStatusColor(row.status)} />
                      </TableCell>
                      <TableCell>
                        {new Date(row.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={10} sx={{ p: 0 }}>
                        <Collapse in={openRow === index}>
                          <Box sx={{ m: 2, p: 2, backgroundColor: "#fafafa", borderRadius: "8px" }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#2c3e50" }}>
                              Order Details
                            </Typography>
                            {row.products.map((prod, i) => (
                              <Typography key={i}>
                                {prod.product?.name || "Product"} × {prod.quantity}
                              </Typography>
                            ))}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ backgroundColor: "#e6fdf8", "& .MuiTablePagination-toolbar": { minHeight: "56px", gap: 1 } }}
        />
      </Paper>
    </Box>
  );
};

export default OrderTable;