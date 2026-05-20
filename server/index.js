import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import authRouter from './routers/authRouters.js';
import categoryRouter from './routers/categoryRouters.js';
import brandRouter from './routers/brandRouters.js';
import productRouter from './routers/productRouters.js';
import priceTierRouter from './routers/priceTierRouters.js';
import customerRouter from './routers/customerRouters.js';
import orderRouter from './routers/orderRouters.js';
import verifyToken from './middlewares/verifyToken.js';
import dashboardRouter from './routers/dashboardRouters.js';
import cors from 'cors';
import prisma from './lib/prisma.js';
import supplierRouter from './routers/supplierRouters.js';
import purchaseRouter from './routers/purcheseRouters.js';
import reportRouter from './routers/reportRouters.js';

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());

const ensureWalkInCustomer = async () => {
	const admin = await prisma.user.findFirst({
		where: { role: 'ADMIN' },
	});
	await prisma.customer.upsert({
		where: { phone: 'walk-in' },
		create: {
			name: 'Walk-in Customer',
			phone: 'walk-in',
			email: 'walk-in@gmail.com',
			createdBy: admin.id,
		},
		update: {},
	});
};

app.use(
	cors({
		origin: 'http://localhost:5173', // frontend URL
		credentials: true, // HttpOnly cookie handle korar jonno eta MUST
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);

app.get('/', (req, res) => {
	res.send('Hello Quickbill!');
});

app.use('/api/auth', authRouter);
app.use('/api/categories', verifyToken, categoryRouter);
app.use('/api/brands', verifyToken, brandRouter);
app.use('/api/products', verifyToken, productRouter);
app.use('/api/products/:id/price-tiers', verifyToken, priceTierRouter);
app.use('/api/customers', verifyToken, customerRouter);
app.use('/api/orders', verifyToken, orderRouter);
app.use('/api/dashboard', verifyToken, dashboardRouter);
app.use('/api/suppliers', verifyToken, supplierRouter);
app.use('/api/purchases', verifyToken, purchaseRouter);
app.use('/api/reports', verifyToken, reportRouter);

app.listen(PORT, async () => {
	console.log(`Your server is running at localhost:${PORT}`);
	await ensureWalkInCustomer();
});
