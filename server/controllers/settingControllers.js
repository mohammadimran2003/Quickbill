import prisma from "../lib/prisma.js";

const getStore = async (req, res) => {
  let store = await prisma.store.findFirst();

  if (!store) {
    store = await prisma.store.create({
      data: {
        name: "My Store",
        currency: "৳",
        taxRate: 0,
      },
    });
  }

  res.status(200).json({ success: true, data: store });
};

const updateStore = async (req, res) => {
  const store = await prisma.store.findFirst();

  const updated = await prisma.store.upsert({
    where: { id: store?.id || "new" },
    create: { ...req.body },
    update: { ...req.body },
  });

  res.status(200).json({ success: true, data: updated });
};

export { getStore, updateStore };
