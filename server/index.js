import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import authRouter from "./routers/authRouters.js";
import categoryRouter from "./routers/categoryRouters.js";
import brandRouter from "./routers/brandRouters.js";
import productRouter from "./routers/productRouters.js";
import priceTierRouter from "./routers/priceTierRouters.js";
import customerRouter from "./routers/customerRouters.js";
import orderRouter from "./routers/orderRouters.js";
import verifyToken from "./middlewares/verifyToken.js";
import dashboardRouter from "./routers/dashboardRouters.js";
import cors from "cors";
import prisma from "./lib/prisma.js";
import supplierRouter from "./routers/supplierRouters.js";
import purchaseRouter from "./routers/purcheseRouters.js";
import reportRouter from "./routers/reportRouters.js";
import returnRouter from "./routers/returnRouters.js";
import userRouter from "./routers/userRouters.js";
import settingRouter from "./routers/settingRouters.js";
import expenseRouter from "./routers/expenseRouters.js";
import errorHandler from "./middlewares/errorHandler.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());

const ensureWalkInCustomer = async () => {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });
  await prisma.customer.upsert({
    where: { phone: "walk-in" },
    create: {
      name: "Walk-in Customer",
      phone: "walk-in",
      email: "walk-in@gmail.com",
      createdBy: admin.id,
    },
    update: {},
  });
};

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/categories", verifyToken, categoryRouter);
app.use("/api/brands", verifyToken, brandRouter);
app.use("/api/products", verifyToken, productRouter);
app.use("/api/products/:id/price-tiers", verifyToken, priceTierRouter);
app.use("/api/customers", verifyToken, customerRouter);
app.use("/api/orders", verifyToken, orderRouter);
app.use("/api/dashboard", verifyToken, dashboardRouter);
app.use("/api/suppliers", verifyToken, supplierRouter);
app.use("/api/purchases", verifyToken, purchaseRouter);
app.use("/api/reports", verifyToken, reportRouter);
app.use("/api/return", verifyToken, returnRouter);
app.use("/api/users", verifyToken, userRouter);
app.use("/api/settings", verifyToken, settingRouter);
app.use("/api/expenses", verifyToken, expenseRouter);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Your server is running at localhost:${PORT}`);
  await ensureWalkInCustomer();
});
