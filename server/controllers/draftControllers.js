import prisma from "../lib/prisma.js";

const createDraft = async (req, res) => {
  const user = req.user;

  const draftOrder = await prisma.draftOrder.create({
    data: { ...req.body, createdBy: user?.id },
  });
  res.status(201).json({
    success: true,
    data: draftOrder,
    message: "Draft created successfully",
  });
};

const getDrafts = async (req, res) => {
  const draftOrders = await prisma.draftOrder.findMany();
  res.status(200).json({
    success: true,
    data: draftOrders,
    message: "Drafts fetched successfully",
  });
};

const getDraft = async (req, res) => {
  const draftOrder = await prisma.draftOrder.findUnique({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data: draftOrder,
    message: "Draft fetched successfully",
  });
};

const updateDraft = async (req, res) => {
  const draftOrder = await prisma.draftOrder.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });
  res.status(200).json({
    success: true,
    data: draftOrder,
    message: "Draft updated successfully",
  });
};

const deleteDraft = async (req, res) => {
  const draftOrder = await prisma.draftOrder.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({
    success: true,
    data: draftOrder,
    message: "Draft deleted successfully",
  });
};

export { createDraft, getDrafts, getDraft, updateDraft, deleteDraft };
