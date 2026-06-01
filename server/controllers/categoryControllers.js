import prisma from "../lib/prisma.js";

const createCategory = async (req, res) => {
  const result = await prisma.category.create({
    data: { ...req.body, createdBy: req.user.id },
  });

  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: result,
  });
};

const getAllCategories = async (req, res) => {
  const { search = "", isActive, page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    ...(search
      ? { OR: [{ name: { contains: search, mode: "insensitive" } }] }
      : {}),
    ...(isActive !== undefined ? { isActive: isActive === "true" } : {}),
  };

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: Number(limit),
    }),
    prisma.category.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    message: "Categories retrieved successfully",
    count: total,
    data: categories,
  });
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Category retrieved successfully",
    data: category,
  });
};

const deleteCategory = async (req, res) => {
  const result = await prisma.category.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
};

const editCategory = async (req, res) => {
  const data = req.body;
  const id = req.params.id;

  const result = await prisma.category.update({
    where: { id },
    data,
  });

  res.status(200).json({
    success: true,
    message: "Category updated succesfully",
    data: result,
  });
};

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  editCategory,
};
