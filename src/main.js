import "./styles.css";

import { createAppMarkup } from "./app.js";
import { DEFAULT_MEMBER } from "./config.js";
import { createExportController } from "./card/export.js";
import { createPreviewController } from "./card/preview.js";
import { renderQrCode } from "./card/qr.js";
import { setupTabs } from "./ui/tabs.js";

const app = document.querySelector("#app");

app.innerHTML = createAppMarkup();

const elements = {
  card: document.getElementById("membership-card"),
  wrapper: document.querySelector(".card-wrapper"),
  cardName: document.getElementById("card-name"),
  cardPhone: document.getElementById("card-phone"),
  cardAddress: document.getElementById("card-address"),
  qrCanvas: document.getElementById("qrcode"),
  inputName: document.getElementById("input-name"),
  inputPhone: document.getElementById("input-phone"),
  inputAddress: document.getElementById("input-address"),
  panelSingle: document.getElementById("panel-single"),
  panelBulk: document.getElementById("panel-bulk"),
  tabSingle: document.getElementById("tab-single"),
  tabBulk: document.getElementById("tab-bulk"),
  btnSingle: document.getElementById("btn-single"),
  btnBulk: document.getElementById("btn-bulk"),
  bulkData: document.getElementById("bulk-data"),
  progressArea: document.getElementById("progress-area"),
  progressBar: document.getElementById("progress-bar"),
  progressText: document.getElementById("progress-text"),
  singleStatus: document.getElementById("single-status"),
  bulkStatus: document.getElementById("bulk-status"),
};

const previewController = createPreviewController(elements, renderQrCode);
const exportController = createExportController(elements, previewController);

setupTabs(elements);

elements.inputName.addEventListener("input", () => {
  previewController.updateCard();
});
elements.inputPhone.addEventListener("input", () => {
  previewController.updateCard();
});
elements.inputAddress.addEventListener("input", () => {
  previewController.updateCard();
});
elements.btnSingle.addEventListener("click", () => {
  exportController.exportSinglePNG();
});
elements.btnBulk.addEventListener("click", () => {
  exportController.exportBulkZip();
});

window.addEventListener("resize", () => {
  previewController.syncPreviewScale();
});

await previewController.updateCard(DEFAULT_MEMBER);
previewController.syncPreviewScale();
