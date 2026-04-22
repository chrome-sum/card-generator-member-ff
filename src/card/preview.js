import { CARD_SIZE, DEFAULT_MEMBER } from "../config.js";
import { formatPhone, normalizePhone } from "../utils/phone.js";

export function createPreviewController(elements, renderQrCode) {
  const {
    card,
    wrapper,
    cardMainSection,
    cardName,
    cardPhone,
    cardAddress,
    qrSection,
    inputName,
    inputPhone,
    inputAddress,
    qrCanvas,
  } = elements;
  let qrRenderToken = 0;

  function getTextWidth(element) {
    const range = document.createRange();
    range.selectNodeContents(element);

    return Math.ceil(range.getBoundingClientRect().width);
  }

  function fitCardText(element, maxSize, minSize, step, safeGap = 0) {
    let size = maxSize;
    element.style.fontSize = `${maxSize}px`;

    while (size > minSize && getTextWidth(element) > element.clientWidth) {
      size = Math.max(size - step, minSize);
      element.style.fontSize = `${size}px`;
    }

    while (
      safeGap > 0 &&
      size > minSize &&
      getTextWidth(element) > Math.max(element.clientWidth - safeGap, 0)
    ) {
      size -= 1;
      element.style.fontSize = `${size}px`;
    }
  }

  function clearQrCanvas(canvas) {
    const context = canvas.getContext?.("2d");

    if (context?.clearRect) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function copyQrCanvas(sourceCanvas, targetCanvas) {
    const context = targetCanvas.getContext?.("2d");

    targetCanvas.width = sourceCanvas.width || targetCanvas.width;
    targetCanvas.height = sourceCanvas.height || targetCanvas.height;

    if (!context) {
      return;
    }

    context.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    context.drawImage(sourceCanvas, 0, 0);
  }

  async function updateCard(member = {}, options = {}) {
    const renderToken = ++qrRenderToken;
    const name = member.name ?? (inputName.value.trim() || DEFAULT_MEMBER.name);
    const phone = member.phone ?? (inputPhone.value.trim() || DEFAULT_MEMBER.phone);
    const address = member.address ?? (inputAddress.value.trim() || DEFAULT_MEMBER.address);
    const normalizedPhone = normalizePhone(phone);
    const qrEnabled = options.qrEnabled ?? false;
    const shouldShowQr = qrEnabled && Boolean(normalizedPhone);

    cardName.innerText = name.toUpperCase();
    cardPhone.innerText = formatPhone(normalizedPhone) || "-";
    cardAddress.innerText = address.toUpperCase();
    qrSection.classList.toggle("hidden", !shouldShowQr);
    cardMainSection?.classList.toggle("card-main-single-column", !shouldShowQr);

    fitCardText(cardName, 60, 36, 8, 4);
    fitCardText(cardPhone, 36, 24, 4, 4);
    fitCardText(cardAddress, 24, 18, 3, 2);

    if (!shouldShowQr) {
      clearQrCanvas(qrCanvas);
      return;
    }

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = qrCanvas.width;
    tempCanvas.height = qrCanvas.height;

    await renderQrCode(tempCanvas, `https://wa.me/${normalizedPhone}`);

    if (renderToken !== qrRenderToken) {
      return;
    }

    copyQrCanvas(tempCanvas, qrCanvas);
  }

  function syncPreviewScale() {
    const width = Math.min(wrapper.clientWidth || 500, 500);
    const scale = width / CARD_SIZE.width;
    wrapper.style.setProperty("--preview-scale", scale.toString());
    wrapper.style.height = `${CARD_SIZE.height * scale}px`;
  }

  function prepareForExport() {
    wrapper.style.maxWidth = `${CARD_SIZE.width}px`;
    wrapper.style.height = `${CARD_SIZE.height}px`;
    card.classList.remove("preview-scale");
  }

  function restoreAfterExport() {
    wrapper.style.maxWidth = "";
    card.classList.add("preview-scale");
    syncPreviewScale();
  }

  return {
    updateCard,
    syncPreviewScale,
    prepareForExport,
    restoreAfterExport,
  };
}
