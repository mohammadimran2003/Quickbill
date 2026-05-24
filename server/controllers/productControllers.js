import prisma from "../lib/prisma.js";

const createProduct = async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        createdBy: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.log(err, "err");

    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `${err.meta.target[0]} already exists`,
      });
    }

    res.status(500).json({ success: false, message: "Server internal error!" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const {
      categoryId = "",
      page = 1,
      brandId = "",
      limit = 10,
      search = "",
      sku = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      productType = "",
      stockStatus = "",
    } = req.query;

    console.log(req.query, "req.query");

    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(search
        ? {
            name: { contains: search, mode: "insensitive" },
          }
        : {}),
      ...(sku ? { sku: { contains: sku, mode: "insensitive" } } : {}),
      ...(categoryId ? { categoryId: categoryId } : {}),
      ...(brandId ? { brandId: brandId } : {}),
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
  } catch (err) {
    console.log(err, "err");
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await prisma.product.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (err) {
    console.log(err, "err");
    res.status(500).json({ success: false, message: "product deleted failed" });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    res.status(200).json({
      success: true,
      message: "product retrieved successfully",
      data: product,
    });
  } catch (err) {
    console.log(err, "err");
    res.status(500).json({ success: false, message: "Server internal error!" });
  }
};

const editProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const existingProduct = await prisma.product.findUnique({ where: { id } });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      daata: updatedProduct,
    });
  } catch (err) {
    console.log(err, "err");
    res.status(500).json({ success: false, message: "Server internal error" });
  }
};

const getLowStockProduct = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err, "err");
    res.status(500).json({ success: false, message: "Server internal error" });
  }
};

export {
  createProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
  editProduct,
  getLowStockProduct,
};
