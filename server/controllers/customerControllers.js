import prisma from '../lib/prisma.js';

const createCustomer = async (req, res) => {
	try {
		const { phone, email } = req.body;

		const existingPhone = await prisma.customer.findUnique({
			where: { phone },
		});
		if (existingPhone) {
			return res.status(409).json({
				success: false,
				message: 'Customer with this phone number already exists',
			});
		}

		if (email) {
			const existingEmail = await prisma.customer.findUnique({
				where: { email },
			});
			if (existingEmail) {
				return res.status(409).json({
					success: false,
					message: 'Customer with this email already exists',
				});
			}
		}

		const newCustomer = await prisma.customer.create({
			data: {
				...req.body,
				createdBy: req.user.id,
			},
		});

		return res.status(201).json({
			success: true,
			message: 'Customer created successfully',
			data: newCustomer,
		});
	} catch (err) {
		if (error.code === 'P2002') {
			// P2002 mane holo duplicate entry
			return res.status(400).json({
				message:
					'Ei email-ti diye already ekta account ache. Onno email try korun.',
			});
		}
		console.log(err, 'customer err');
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};
const getCustomers = async (req, res) => {
	try {
		const {
			page = 1,
			limit = 10,
			search = '',
			sortBy = 'createdAt',
			sortOrder = 'desc',
			customerType = '',
		} = req.query;

		console.log(req.query, 'query');

		const skip = (Number(page) - 1) * Number(limit);

		const where = {
			...(search ?
				{
					OR: [
						{ name: { contains: search, mode: 'insensitive' } },
						{ phone: { contains: search } },
						{ email: { contains: search, mode: 'insensitive' } },
					],
				}
			:	{}),
			...(customerType ? { customerType } : {}),
		};

		const [customers, total] = await Promise.all([
			prisma.customer.findMany({
				where,
				skip,
				take: Number(limit),
				orderBy: { [sortBy]: sortOrder },
				include: { _count: { select: { orders: true } } },
			}),
			prisma.customer.count({ where }),
		]);

		return res.status(200).json({
			success: true,
			data: customers,
			pagination: {
				total,
				page: Number(page),
				limit: Number(limit),
				totalPages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error('GET_CUSTOMERS_ERROR:', error); // Debugging er jonno

		return res.status(500).json({
			success: false,
			message: 'Customer data load korte somossya hoyeche.',
			error: process.env.NODE_ENV === 'development' ? error.message : undefined,
		});
	}
};

const getCustomerById = async (req, res) => {
	try {
		const id = req.params.id;
		const customer = await prisma.customer.findUnique({
			where: { id },
		});

		res.status(200).json({
			success: true,
			message: 'Customer retrieved successfully',
			data: customer,
		});
	} catch (err) {
		console.log(err, 'get customer by id err');
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const deleteCustomer = async (req, res) => {
	try {
		const id = req.params.id;
		const customer = await prisma.customer.delete({ where: { id } });

		res.status(200).json({
			success: true,
			message: 'Customer deleted successfully',
			data: customer,
		});
	} catch (err) {
		console.log(err, 'delete customer err');
		res.status(500).json({ success: false, message: 'Server internal error!' });
	}
};

const updateCustomer = async (req, res) => {
	try {
		const id = req.params.id;

		const updatedCustomer = await prisma.customer.update({
			where: { id },
			data: req.body,
		});

		return res.status(200).json({
			success: true,
			message: 'Customer updated successfully',
			data: updatedCustomer,
		});
	} catch (err) {
		if (err.code === 'P2025') {
			return res.status(404).json({
				success: false,
				message: 'Customer not found',
			});
		}

		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

const rechargeWallet = async (req, res) => {
	try {
		const { amount, note } = req.body;
		const customer = await prisma.customer.findUnique({
			where: { id: req.params.id },
		});

		let walletAmount = amount;
		let dueDeduction = 0;

		if (customer.totalDue > 0) {
			dueDeduction = Math.min(customer.totalDue, amount);
			walletAmount = amount - dueDeduction;
		}

		const result = await prisma.$transaction(async (tx) => {
			await tx.customer.update({
				where: { id: customer.id },
				data: {
					totalDue: { decrement: dueDeduction },
					walletBalance: { increment: walletAmount },
				},
			});

			if (dueDeduction > 0) {
				await tx.walletTransaction.create({
					data: {
						type: 'DUE_PAYMENT',
						customerId: customer.id,
						amount: amount,
						dueDeduction,
						walletCredit: 0,
						note: note || null,
						createdBy: req.user.id,
					},
				});
			}

			if (walletAmount > 0) {
				await tx.walletTransaction.create({
					data: {
						type: 'RECHARGE',
						customerId: customer.id,
						amount: amount,
						dueDeduction: 0,
						walletCredit: walletAmount,
						note: note || null,
						createdBy: req.user.id,
					},
				});
			}

			return true;
		});

		console.log(result);

		res.status(200).json({
			success: true,
			message: 'Wallet recharge successfull',
			data: result,
		});
	} catch (err) {
		console.log(err, 'recharge wallet err');
		res.status(500).json({ success: false, message: 'Server internal error' });
	}
};

const getCustomerOrders = async (req, res) => {
	try {
		const customerId = req.params.id;

		const orders = await prisma.order.findMany({
			where: { customerId },
			include: { items: true },
			orderBy: { createdAt: 'desc' },
		});

		return res.status(200).json({
			success: true,
			message: 'Customer orders retrieved successfully',
			count: orders.length,
			data: orders,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

export {
	createCustomer,
	getCustomers,
	getCustomerById,
	deleteCustomer,
	updateCustomer,
	rechargeWallet,
	getCustomerOrders,
};
