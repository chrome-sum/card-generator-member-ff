import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { CARD_SIZE, EXPORT_DELAY_MS } from "../config.js";
import { sanitizeFilename } from "../utils/filename.js";
import { wait } from "../utils/time.js";
import { setStatus } from "../ui/status.js";

export function createExportController(elements, previewController, stateManager) {
  const {
    card,
    btnSingle,
    progressArea,
    progressBar,
    progressText,
    singleStatus,
    bulkStatus,
  } = elements;

  async function waitForFonts() {
    const fontsReady = document.fonts?.ready;

    if (fontsReady && typeof fontsReady.then === "function") {
      await fontsReady;
    }
  }

  async function exportCardToPng() {
    return toPng(card, {
      pixelRatio: 2,
      width: CARD_SIZE.width,
      height: CARD_SIZE.height,
      backgroundColor: "#ffffff",
    });
  }

  async function exportSinglePNG() {
    const state = stateManager.getState();

    if (state.isSingleExporting || state.isBulkExporting) {
      setStatus(singleStatus, "Export sedang berjalan. Tunggu proses sebelumnya selesai.", "info");
      return;
    }

    const originalText = btnSingle.innerText;
    stateManager.setSingleExporting(true);
    btnSingle.disabled = true;
    btnSingle.innerText = "MENYIMPAN GAMBAR...";
    setStatus(singleStatus, "", "info");

    previewController.prepareForExport();

    try {
      await waitForFonts();
      await wait(EXPORT_DELAY_MS.single);
      await previewController.updateCard(state.singleMember, {
        qrEnabled: state.singleQrEnabled,
      });

      const dataUrl = await exportCardToPng();
      const link = document.createElement("a");

      link.download = `ABC-Member-${sanitizeFilename(state.singleMember.name, "Card")}.png`;
      link.href = dataUrl;
      link.click();

      setStatus(singleStatus, "Kartu berhasil diekspor ke PNG.", "success");
    } catch (error) {
      console.error("Gagal render kartu:", error);
      setStatus(singleStatus, "Export PNG gagal. Coba lagi beberapa saat.", "error");
    } finally {
      previewController.restoreAfterExport();
      const nextState = stateManager.getState();
      await previewController.updateCard(nextState.singleMember, {
        qrEnabled: nextState.singleQrEnabled,
      });
      stateManager.setSingleExporting(false);
      btnSingle.disabled = false;
      btnSingle.innerText = originalText;
    }
  }

  async function exportBulkZip() {
    const state = stateManager.getState();

    if (state.isSingleExporting || state.isBulkExporting) {
      setStatus(bulkStatus, "Export sedang berjalan. Tunggu proses sebelumnya selesai.", "info");
      return;
    }

    const {
      validRecords,
      invalidRows,
      invalidDetails,
      skippedHeader,
      totalRows,
    } = state.bulkParseResult;

    if (!state.bulkRawData.trim()) {
      setStatus(bulkStatus, "Isi data bulk terlebih dulu sebelum membuat ZIP.", "error");
      return;
    }

    if (!validRecords.length) {
      setStatus(
        bulkStatus,
        "Tidak ada baris valid. Paste tabel spreadsheet dengan urutan: Nama, WhatsApp, Alamat.",
        "error",
      );
      return;
    }

    const zip = new JSZip();
    progressBar.style.width = "0%";
    progressText.innerText = "0%";
    progressArea.classList.remove("hidden");
    stateManager.setBulkExporting(true);
    setStatus(
      bulkStatus,
      [
        `Terbaca ${totalRows} baris`,
        skippedHeader ? "header dilewati" : null,
        `${validRecords.length} valid`,
        invalidRows.length
          ? `${invalidRows.length} invalid (${invalidDetails
              .map((detail) => `baris ${detail.row}: ${detail.reason}`)
              .join(", ")})`
          : "0 invalid",
      ]
        .filter(Boolean)
        .join(" - "),
      "info",
    );

    previewController.prepareForExport();

    try {
      await waitForFonts();

      for (let index = 0; index < validRecords.length; index += 1) {
        const record = validRecords[index];
        await previewController.updateCard(record, { qrEnabled: state.bulkQrEnabled });
        await wait(EXPORT_DELAY_MS.bulk);

        const dataUrl = await exportCardToPng();
        const fileName = `${index + 1}-${sanitizeFilename(record.name, `Member_${index + 1}`)}.png`;

        zip.file(fileName, dataUrl.split(",")[1], { base64: true });

        const progressValue = Math.round(((index + 1) / validRecords.length) * 100);
        progressBar.style.width = `${progressValue}%`;
        progressText.innerText = `${progressValue}% - ${index + 1}/${validRecords.length}`;
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "Batch_Member_ABC_Jaya.zip");

      setStatus(
        bulkStatus,
        [
          "ZIP berhasil dibuat.",
          `${validRecords.length} kartu diekspor`,
          invalidRows.length
            ? `${invalidRows.length} baris invalid dilewati (${invalidDetails
                .map((detail) => `baris ${detail.row}: ${detail.reason}`)
                .join(", ")})`
            : null,
          skippedHeader ? "header otomatis diabaikan" : null,
        ]
          .filter(Boolean)
          .join(" - "),
        "success",
      );
    } catch (error) {
      console.error("Gagal membuat ZIP:", error);
      setStatus(bulkStatus, "Pembuatan ZIP gagal. Periksa data dan coba lagi.", "error");
    } finally {
      previewController.restoreAfterExport();
      progressArea.classList.add("hidden");
      progressBar.style.width = "0%";
      progressText.innerText = "0%";
      stateManager.setBulkExporting(false);
      const nextState = stateManager.getState();
      await previewController.updateCard(nextState.singleMember, {
        qrEnabled: nextState.singleQrEnabled,
      });
    }
  }

  return {
    exportSinglePNG,
    exportBulkZip,
  };
}
