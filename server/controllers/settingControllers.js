import prisma from "../lib/prisma.js";

const getStore = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateStore = async (req, res) => {
  try {
    const store = await prisma.store.findFirst();

    const updated = await prisma.store.upsert({
      where: { id: store?.id || "new" },
      create: { ...req.body },
      update: { ...req.body },
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { getStore, updateStore };
