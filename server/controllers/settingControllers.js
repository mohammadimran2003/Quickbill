import prisma from "../lib/prisma.js";

const getStore = async (req, res) => {
  let store = await prisma.store.findFirst();

  console.log(req.params, "params");

  if (!store) {
    store = await prisma.store.create({
      data: {
        name: "My Store",
        address: "Bhaluka, mymensingh",
        binNumber: "379032842384390479032",
        phone: "01849967861",
        email: "quickbill@gmail.com",
        currency: {
          code: "BDT",
          symbol: "৳",
          name: "Bangladeshi Taka",
        },
        taxRate: 0,
      },
    });
  }

  res.status(200).json({ success: true, data: store });
};

const updateStore = async (req, res) => {
  const store = await prisma.store.findFirst();
  const { currency, ...otherFields } = req.body;
  console.log(req.body, "store data");

  const updated = await prisma.store.update({
    where: { id: store?.id || "new" },
    data: {
      ...otherFields,
      currency: currency || {
        code: "BDT",
        symbol: "৳",
        name: "Bangladeshi Taka",
      },
    },
  });

  res.status(200).json({ success: true, data: updated });
};

export { getStore, updateStore };
