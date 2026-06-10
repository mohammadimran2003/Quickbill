import prisma from "../lib/prisma.js";
import generateBarcode from "../lib/utils/generateBarcode.js";

const createProduct = async (req, res) => {
  const barcode = req.body?.barcode || `QB-${Date.now()}`;

  const barcodeData = await generateBarcode(barcode);

  const product = await prisma.product.create({
    data: {
      ...req.body,
      createdBy: req.user.id,
      barcode,
      barcodeImage: barcodeData,
    },
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

const getAllProducts = async (req, res) => {
  const {
    category = "",
    page = 1,
    brand = "",
    limit = 10,
    productName = "",
    sku = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    productType = "",
    stockStatus = "",
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const where = {
    ...(productName
      ? {
          name: { contains: productName, mode: "insensitive" },
        }
      : {}),
    ...(sku ? { sku: { contains: sku, mode: "insensitive" } } : {}),
    ...(category ? { categoryId: category } : {}),
    ...(brand ? { brandId: brand } : {}),
    ...(productType ? { productType } : {}),
    ...(stockStatus
      ? {
          stock: {
            lte: prisma.product.fields.lowStockAlert,
          },
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: { select: { name: true } },
        priceTiers: true,
        brand: { select: { name: true, id: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  const product = await prisma.product.delete({ where: { id } });

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: product,
  });
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      priceTiers: true,
      brand: { select: { name: true, id: true } },
    },
  });

  res.status(200).json({
    success: true,
    message: "product retrieved successfully",
    data: product,
  });
};

const editProduct = async (req, res) => {
  const id = req.params.id;

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: req.body,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    daata: updatedProduct,
  });
};

const getLowStockProduct = async (req, res) => {
  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: {
        lte: prisma.product.fields.lowStockAlert,
      },
    },
    take: 5,
    orderBy: {
      stock: "asc",
    },
  });

  res.status(200).json({
    success: true,
    message: "Low stock products retrieved successfully",
    data: lowStockProducts,
  });
};

export {
  createProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
  editProduct,
  getLowStockProduct,
};
