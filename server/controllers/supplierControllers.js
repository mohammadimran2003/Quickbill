import prisma from "../lib/prisma.js";

const createSuppliser = async (req, res) => {
  const { name, phone, email, address, note, isActive } = req.body;
  const createdBy = req.userId;

  const supplier = await prisma.supplier.create({
    data: {
      name,
      phone,
      email,
      address,
      note,
      isActive,
      createdBy,
    },
  });

  res.status(201).json({
    success: true,
    message: "Supplier created successfully",
    data: supplier,
  });
};

const getSuppliers = async (req, res) => {
  const {
    search,
    isActive,
    page = 1,
    limit = 10,
    sortBy = "name",
    sortOrder = "asc",
  } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skipNum = (pageNum - 1) * limitNum;
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (isActive !== undefined && isActive !== "") {
    where.isActive = isActive === "true";
  }

  const suppliers = await prisma.supplier.findMany({
    where,
    include: {
      purchases: {
        include: {
          items: true,
        },
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip: skipNum,
    take: limitNum,
  });

  const total = await prisma.supplier.count({ where });

  res.status(200).json({
    success: true,
    message: "Suppliers retrieved successfully",
    count: total,
    data: suppliers,
  });
};

const getSupplierById = async (req, res) => {
  const { id } = req.params;
  const supplier = await prisma.supplier.findUnique({
    where: { id },
  });
  res.status(200).json({
    success: true,
    message: "Supplier retrieved successfully",
    data: supplier,
  });
};

const updateSupplier = async (req, res) => {
  const { id } = req.params;
  const supplier = await prisma.supplier.update({
    where: { id },
    data: {
      ...req.body,
    },
  });
  res.status(200).json({
    success: true,
    message: "Supplier updated successfully",
    data: supplier,
  });
};

const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  await prisma.supplier.delete({
    where: { id },
  });
  res.status(200).json({ message: "Supplier deleted successfully" });
};

export {
  createSuppliser,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
};
