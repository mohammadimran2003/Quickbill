import bwipjs from "bwip-js";

const generateBarcode = async (text) => {
  const png = await bwipjs.toBuffer({
    bcid: "code128", // barcode type
    text, // barcode value
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: "center",
  });

  return `data:image/png;base64,${png.toString("base64")}`;
};

export default generateBarcode;
