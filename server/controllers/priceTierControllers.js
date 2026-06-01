import prisma from "../lib/prisma.js";
import AppError from "../lib/utils/AppError.js";

const createPriceTier = async (req, res) => {
  const productId = req.params.id;

  //product ache kina check
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const priceTier = await prisma.priceTier.create({
    data: { ...req.body, productId, createdBy: req.user.id },
  });

  res.status(201).json({
    success: true,
    message: "Price tiers retrieve sucessfully",
    data: priceTier,
  });
};

const deletePriceTier = async (req, res) => {
  const tierId = req.params.tierId;

  const priceTier = await prisma.priceTier.delete({ where: { id: tierId } });

  res.status(200).json({
    success: true,
    message: "Price tier deleted succcessfully",
    data: priceTier,
  });
};

const editPriceTier = async (req, res) => {
  const tierId = req.params.tierId;

  const updatedPriceTier = await prisma.priceTier.update({
    where: {
      id: tierId,
      name: req.body.name,
    },
    data: req.body,
  });

  res.status(200).json({
    success: true,
    message: "Price tier udpated successfully",
    data: updatedPriceTier,
  });
};

export { createPriceTier, deletePriceTier, editPriceTier };
