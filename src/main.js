import "./styles.css";

import { createAppMarkup } from "./app.js";
import { DEFAULT_MEMBER } from "./config.js";
import { createExportController } from "./card/export.js";
import { createPreviewController } from "./card/preview.js";
import { renderQrCode } from "./card/qr.js";
import { setupTabs } from "./ui/tabs.js";
import { parseBulkRecords } from "./utils/bulk.js";

const app = document.querySelector("#app");

app.innerHTML = createAppMarkup();

const elements = {
  card: document.getElementById("membership-card"),
  wrapper: document.querySelector(".card-wrapper"),
  cardName: document.getElementById("card-name"),
  cardPhone: document.getElementById("card-phone"),
  cardAddress: document.getElementById("card-address"),
  qrSection: document.getElementById("qr-section"),
  qrCanvas: document.getElementById("qrcode"),
  inputName: document.getElementById("input-name"),
  inputPhone: document.getElementById("input-phone"),
  inputAddress: document.getElementById("input-address"),
  singleUseQr: document.getElementById("single-use-qr"),
  bulkUseQr: document.getElementById("bulk-use-qr"),
  panelSingle: document.getElementById("panel-single"),
  panelBulk: document.getElementById("panel-bulk"),
  tabSingle: document.getElementById("tab-single"),
  tabBulk: document.getElementById("tab-bulk"),
  btnSingle: document.getElementById("btn-single"),
  btnBulk: document.getElementById("btn-bulk"),
  bulkData: document.getElementById("bulk-data"),
  bulkPreview: document.getElementById("bulk-preview"),
  bulkSummary: document.getElementById("bulk-summary"),
  bulkValidPreview: document.getElementById("bulk-valid-preview"),
  bulkInvalidPreview: document.getElementById("bulk-invalid-preview"),
  progressArea: document.getElementById("progress-area"),
  progressBar: document.getElementById("progress-bar"),
  progressText: document.getElementById("progress-text"),
  singleStatus: document.getElementById("single-status"),
  bulkStatus: document.getElementById("bulk-status"),
};

const state = {
  singleMember: { ...DEFAULT_MEMBER },
  singleQrEnabled: false,
  bulkRawData: "",
  bulkQrEnabled: false,
  bulkParseResult: {
    validRecords: [],
    invalidRows: [],
    invalidDetails: [],
    skippedHeader: false,
    totalRows: 0,
  },
  isBulkExporting: false,
};

function getState() {
  return structuredClone(state);
}

function syncBulkParseResult() {
  state.bulkParseResult = state.bulkRawData.trim()
    ? parseBulkRecords(state.bulkRawData)
    : {
        validRecords: [],
        invalidRows: [],
        invalidDetails: [],
        skippedHeader: false,
        totalRows: 0,
      };
}

function renderBulkPreview() {
  if (!state.bulkRawData.trim()) {
    elements.bulkPreview.classList.add("hidden");
    elements.bulkSummary.textContent = "";
    elements.bulkValidPreview.innerHTML = "";
    elements.bulkInvalidPreview.innerHTML = "";
    elements.btnBulk.disabled = true;
    return;
  }

  const { validRecords, invalidDetails, skippedHeader, totalRows } = state.bulkParseResult;
  const validPreview = validRecords
    .slice(0, 5)
    .map((record, index) => {
      const phoneValue = record.phone || "-";

      return `
        <div class="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs text-gray-700">
          <span class="font-black text-emerald-700">Valid ${index + 1}</span> - ${record.name} | ${phoneValue} | ${record.address}
        </div>
      `;
    })
    .join("");

  const invalidPreview = invalidDetails
    .slice(0, 5)
    .map(
      (detail) => `
        <div class="rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs text-rose-700">
          <span class="font-black">Baris ${detail.row}</span> - ${detail.reason}
        </div>
      `,
    )
    .join("");

  elements.bulkPreview.classList.remove("hidden");
  elements.bulkSummary.textContent = [
    `${totalRows} baris terbaca`,
    skippedHeader ? "1 header dilewati" : null,
    `${validRecords.length} valid`,
    `${invalidDetails.length} invalid`,
  ]
    .filter(Boolean)
    .join(" - ");
  elements.bulkValidPreview.innerHTML = validPreview
    ? `<p class="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Data Valid</p>${validPreview}`
    : "";
  elements.bulkInvalidPreview.innerHTML = invalidPreview
    ? `<p class="text-[10px] font-bold text-rose-600 uppercase tracking-[0.2em]">Data Invalid</p>${invalidPreview}`
    : "";
  elements.btnBulk.disabled = validRecords.length === 0 || state.isBulkExporting;
}

async function renderSinglePreview() {
  await previewController.updateCard(state.singleMember, {
    qrEnabled: state.singleQrEnabled,
  });
}

function syncSingleStateFromInputs() {
  state.singleMember = {
    name: elements.inputName.value.trim() || DEFAULT_MEMBER.name,
    phone: elements.inputPhone.value.trim() || DEFAULT_MEMBER.phone,
    address: elements.inputAddress.value.trim() || DEFAULT_MEMBER.address,
  };
}

function syncInputsFromState() {
  elements.inputName.value = state.singleMember.name === DEFAULT_MEMBER.name ? "" : state.singleMember.name;
  elements.inputPhone.value =
    state.singleMember.phone === DEFAULT_MEMBER.phone ? "" : state.singleMember.phone;
  elements.inputAddress.value =
    state.singleMember.address === DEFAULT_MEMBER.address ? "" : state.singleMember.address;
  elements.singleUseQr.checked = state.singleQrEnabled;
  elements.bulkUseQr.checked = state.bulkQrEnabled;
  elements.bulkData.value = state.bulkRawData;
}

function setBulkExporting(isBulkExporting) {
  state.isBulkExporting = isBulkExporting;
  renderBulkPreview();
}

const previewController = createPreviewController(elements, renderQrCode);
const exportController = createExportController(elements, previewController, {
  getState,
  setBulkExporting,
});

setupTabs(elements);

elements.inputName.addEventListener("input", () => {
  syncSingleStateFromInputs();
  renderSinglePreview();
});
elements.inputPhone.addEventListener("input", () => {
  syncSingleStateFromInputs();
  renderSinglePreview();
});
elements.inputAddress.addEventListener("input", () => {
  syncSingleStateFromInputs();
  renderSinglePreview();
});
elements.singleUseQr.addEventListener("change", () => {
  state.singleQrEnabled = elements.singleUseQr.checked;
  renderSinglePreview();
});
elements.bulkUseQr.addEventListener("change", () => {
  state.bulkQrEnabled = elements.bulkUseQr.checked;
});
elements.bulkData.addEventListener("input", () => {
  state.bulkRawData = elements.bulkData.value;
  syncBulkParseResult();
  renderBulkPreview();
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

syncBulkParseResult();
syncInputsFromState();
await renderSinglePreview();
previewController.syncPreviewScale();
renderBulkPreview();
