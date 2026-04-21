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

  async function updateCard(member = {}, options = {}) {
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
    cardMainSection.classList.toggle("card-main-single-column", !shouldShowQr);

    fitCardText(cardName, 60, 36, 8, 4);
    fitCardText(cardPhone, 36, 24, 4, 4);
    fitCardText(cardAddress, 24, 18, 3, 2);

    if (shouldShowQr) {
      await renderQrCode(qrCanvas, `https://wa.me/${normalizedPhone}`);
    }
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
