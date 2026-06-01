import prisma from "../lib/prisma.js";
import AppError from "../lib/utils/AppError.js";

const createBrand = async (req, res) => {
  // creat brand and push db
  const result = await prisma.brand.create({
    data: { ...req.body, createdBy: req.user.id },
  });

  res.status(201).json({
    success: true,
    message: "Brand created successfully",
    data: result,
  });
};

const getAllBrands = async (req, res) => {
  const { search, isActive, page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    ...(isActive !== undefined && isActive !== ""
      ? { isActive: isActive === "true" }
      : {}),
  };

  const [brands, total] = await Promise.all([
    prisma.brand.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: skip,
      take: Number(limit),
    }),
    prisma.brand.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    message: "brands retrieved successfully",
    count: total,
    data: brands,
  });
};

const getBrandById = async (req, res) => {
  const { id } = req.params;

  const brand = await prisma.brand.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: "Brand retrieved successfully",
    data: brand,
  });
};

const deleteBrand = async (req, res) => {
  const id = req.params.id;

  const result = await prisma.brand.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: "Brand deleted successfully",
    data: result,
  });
};

const editBrand = async (req, res) => {
  const id = req.params.id;

  const result = await prisma.brand.update({ where: { id }, data: req.body });

  res.status(200).json({
    success: true,
    message: "Brand updated successfully",
    data: result,
  });
};

export { createBrand, getAllBrands, getBrandById, deleteBrand, editBrand };
