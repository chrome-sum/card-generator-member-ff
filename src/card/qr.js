import QRCode from "qrcode";

export async function renderQrCode(canvas, value) {
  await QRCode.toCanvas(canvas, value, {
    width: 175,
    margin: 0,
    color: {
      dark: "#111827",
      light: "#ffffff",
    },
    errorCorrectionLevel: "M",
  });
}
