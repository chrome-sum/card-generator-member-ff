import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { CARD_SIZE, DEFAULT_MEMBER, EXPORT_DELAY_MS } from "../config.js";
import { sanitizeFilename } from "../utils/filename.js";
import { parseBulkRecords } from "../utils/bulk.js";
import { wait } from "../utils/time.js";
import { setStatus } from "../ui/status.js";

export function createExportController(elements, previewController) {
  const {
    card,
    btnSingle,
    btnBulk,
    bulkData,
    progressArea,
    progressBar,
    progressText,
    singleStatus,
    bulkStatus,
    inputName,
  } = elements;

  async function exportCardToPng() {
    return toPng(card, {
      pixelRatio: 2,
      width: CARD_SIZE.width,
      height: CARD_SIZE.height,
      backgroundColor: "#ffffff",
    });
  }

  async function exportSinglePNG() {
    const originalText = btnSingle.innerText;
    btnSingle.disabled = true;
    btnSingle.innerText = "MENYIMPAN GAMBAR...";
    setStatus(singleStatus, "", "info");

    previewController.prepareForExport();

    try {
      await document.fonts.ready;
      await wait(EXPORT_DELAY_MS.single);

      const dataUrl = await exportCardToPng();
      const link = document.createElement("a");

      link.download = `ABC-Member-${sanitizeFilename(inputName.value, "Card")}.png`;
      link.href = dataUrl;
      link.click();

      setStatus(singleStatus, "Kartu berhasil diekspor ke PNG.", "success");
    } catch (error) {
      console.error("Gagal render kartu:", error);
      setStatus(singleStatus, "Export PNG gagal. Coba lagi beberapa saat.", "error");
    } finally {
      previewController.restoreAfterExport();
      btnSingle.disabled = false;
      btnSingle.innerText = originalText;
    }
  }

  async function exportBulkZip() {
    const rawData = bulkData.value.trim();

    if (!rawData) {
      setStatus(bulkStatus, "Isi data bulk terlebih dulu sebelum membuat ZIP.", "error");
      return;
    }

    const { validRecords, invalidLines } = parseBulkRecords(rawData, DEFAULT_MEMBER.address);

    if (!validRecords.length) {
      setStatus(bulkStatus, "Tidak ada baris valid. Gunakan format: Nama, WhatsApp, Alamat.", "error");
      return;
    }

    const zip = new JSZip();
    progressBar.style.width = "0%";
    progressText.innerText = "0%";
    progressArea.classList.remove("hidden");
    btnBulk.disabled = true;
    setStatus(
      bulkStatus,
      invalidLines.length
        ? `Baris tidak valid dilewati: ${invalidLines.join(", ")}.`
        : "Sedang membuat ZIP kartu member.",
      invalidLines.length ? "info" : "success",
    );

    previewController.prepareForExport();

    try {
      await document.fonts.ready;

      for (let index = 0; index < validRecords.length; index += 1) {
        const record = validRecords[index];
        await previewController.updateCard(record);
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
        invalidLines.length
          ? `ZIP selesai dibuat. ${invalidLines.length} baris invalid dilewati.`
          : "ZIP berhasil dibuat.",
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
      btnBulk.disabled = false;
      await previewController.updateCard();
    }
  }

  return {
    exportSinglePNG,
    exportBulkZip,
  };
}
