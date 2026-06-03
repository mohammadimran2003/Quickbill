import prisma from "../lib/prisma.js";
import AppError from "../lib/utils/AppError.js";

const createCustomer = async (req, res) => {
  const newCustomer = await prisma.customer.create({
    data: {
      ...req.body,
      createdBy: req.user.id,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data: newCustomer,
  });
};

const getCustomers = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    email = "",
    phone = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    customerType = "",
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    ...(email
      ? {
          email: { contains: email, mode: "insensitive" },
        }
      : {}),
    ...(phone
      ? {
          phone: { contains: phone },
        }
      : {}),
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
};

const getCustomerByPhone = async (req, res) => {
  const { phone } = req.params;

  const customer = await prisma.customer.findFirst({
    where: {
      phone: {
        equals: phone,
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Customer retrieved successfully",
    data: customer,
  });
};

const getCustomerById = async (req, res) => {
  const id = req.params.id;
  console.log(req.body, "req.body");

  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  res.status(200).json({
    success: true,
    message: "Customer retrieved successfully",
    data: customer,
  });
};

const deleteCustomer = async (req, res) => {
  const id = req.params.id;
  const customer = await prisma.customer.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: "Customer deleted successfully",
    data: customer,
  });
};

const updateCustomer = async (req, res) => {
  const id = req.params.id;

  const updatedCustomer = await prisma.customer.update({
    where: { id },
    data: req.body,
  });

  return res.status(200).json({
    success: true,
    message: "Customer updated successfully",
    data: updatedCustomer,
  });
};

const rechargeWallet = async (req, res) => {
  const { amount, note } = req.body;

  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id },
  });

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  let walletAmount = amount;
  let dueDeduction = 0;

  if (customer.totalDue > 0) {
    dueDeduction = Math.min(customer.totalDue, amount);
    walletAmount = amount - dueDeduction;
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedCustomer = await tx.customer.update({
      where: { id: customer.id },
      data: {
        totalDue: { decrement: dueDeduction },
        walletBalance: { increment: walletAmount },
      },
    });

    let dueTx = null;
    let rechargeTx = null;

    if (dueDeduction > 0) {
      dueTx = await tx.walletTransaction.create({
        data: {
          type: "DUE_PAYMENT",
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
      rechargeTx = await tx.walletTransaction.create({
        data: {
          type: "RECHARGE",
          customerId: customer.id,
          amount: amount,
          dueDeduction: 0,
          walletCredit: walletAmount,
          note: note || null,
          createdBy: req.user.id,
        },
      });
    }

    return {
      customer: updatedCustomer,
      dueTransaction: dueTx,
      rechargeTransaction: rechargeTx,
    };
  });

  res.status(200).json({
    success: true,
    message: "Wallet recharge successfully",
    data: result,
  });
};

const getCustomerOrders = async (req, res) => {
  const customerId = req.params.id;

  const orders = await prisma.order.findMany({
    where: { customerId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return res.status(200).json({
    success: true,
    message: "Customer orders retrieved successfully",
    count: orders.length,
    data: orders,
  });
};

export {
  createCustomer,
  getCustomers,
  getCustomerById,
  deleteCustomer,
  updateCustomer,
  rechargeWallet,
  getCustomerOrders,
  getCustomerByPhone,
};
