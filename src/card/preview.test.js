import { afterEach, describe, expect, it, vi } from "vitest";

import { createPreviewController } from "./preview.js";

function createClassList(initialClasses = []) {
  const classes = new Set(initialClasses);

  return {
    add: (...tokens) => tokens.forEach((token) => classes.add(token)),
    remove: (...tokens) => tokens.forEach((token) => classes.delete(token)),
    toggle: (token, force) => {
      if (force === undefined) {
        if (classes.has(token)) {
          classes.delete(token);
          return false;
        }

        classes.add(token);
        return true;
      }

      if (force) {
        classes.add(token);
        return true;
      }

      classes.delete(token);
      return false;
    },
    contains: (token) => classes.has(token),
  };
}

function createTextElement(clientWidth = 400) {
  return {
    style: {},
    clientWidth,
    innerText: "",
  };
}

function createCanvas(width = 175, height = 175) {
  const operations = [];
  const context = {
    clearRect: (...args) => operations.push({ type: "clearRect", args }),
    drawImage: (...args) => operations.push({ type: "drawImage", args }),
  };

  return {
    width,
    height,
    operations,
    getContext: vi.fn(() => context),
  };
}

function createDeferred() {
  let resolve;
  const promise = new Promise((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
}

function createElements() {
  return {
    card: {
      classList: createClassList(["preview-scale"]),
    },
    wrapper: {
      clientWidth: 500,
      style: {
        setProperty: vi.fn(),
      },
    },
    cardName: createTextElement(),
    cardPhone: createTextElement(),
    cardAddress: createTextElement(),
    qrSection: {
      classList: createClassList(["hidden"]),
    },
    inputName: { value: "" },
    inputPhone: { value: "" },
    inputAddress: { value: "" },
    qrCanvas: createCanvas(),
  };
}

const originalDocument = globalThis.document;

afterEach(() => {
  globalThis.document = originalDocument;
});

describe("createPreviewController", () => {
  it("commits only the latest QR render result", async () => {
    const elements = createElements();
    const firstQr = createDeferred();
    const secondQr = createDeferred();
    const renderQrCode = vi
      .fn()
      .mockImplementationOnce(() => firstQr.promise)
      .mockImplementationOnce(() => secondQr.promise);

    globalThis.document = {
      createRange: () => ({
        selectNodeContents: vi.fn(),
        getBoundingClientRect: () => ({ width: 0 }),
      }),
      createElement: vi
        .fn()
        .mockImplementationOnce(() => createCanvas())
        .mockImplementationOnce(() => createCanvas()),
    };

    const controller = createPreviewController(elements, renderQrCode);

    const firstUpdate = controller.updateCard(
      { name: "First", phone: "08123456789", address: "Bandung" },
      { qrEnabled: true },
    );
    const secondUpdate = controller.updateCard(
      { name: "Second", phone: "082222222222", address: "Jakarta" },
      { qrEnabled: true },
    );

    secondQr.resolve();
    await secondUpdate;

    firstQr.resolve();
    await firstUpdate;

    expect(renderQrCode).toHaveBeenNthCalledWith(1, expect.any(Object), "https://wa.me/628123456789");
    expect(renderQrCode).toHaveBeenNthCalledWith(2, expect.any(Object), "https://wa.me/6282222222222");
    expect(elements.cardPhone.innerText).toBe("+62 822-2222-2222");
    expect(
      elements.qrCanvas.operations.filter((operation) => operation.type === "drawImage"),
    ).toHaveLength(1);
  });

  it("keeps QR hidden and clears the canvas when a newer render disables QR", async () => {
    const elements = createElements();
    const firstQr = createDeferred();
    const renderQrCode = vi.fn().mockImplementationOnce(() => firstQr.promise);

    globalThis.document = {
      createRange: () => ({
        selectNodeContents: vi.fn(),
        getBoundingClientRect: () => ({ width: 0 }),
      }),
      createElement: vi.fn(() => createCanvas()),
    };

    const controller = createPreviewController(elements, renderQrCode);

    const firstUpdate = controller.updateCard(
      { name: "First", phone: "08123456789", address: "Bandung" },
      { qrEnabled: true },
    );

    await controller.updateCard(
      { name: "Second", phone: "", address: "Jakarta" },
      { qrEnabled: false },
    );

    firstQr.resolve();
    await firstUpdate;

    expect(elements.qrSection.classList.contains("hidden")).toBe(true);
    expect(
      elements.qrCanvas.operations.some((operation) => operation.type === "clearRect"),
    ).toBe(true);
    expect(
      elements.qrCanvas.operations.some((operation) => operation.type === "drawImage"),
    ).toBe(false);
  });

  it("keeps the same max font size for short text when QR is toggled on", async () => {
    const elements = createElements();
    const renderQrCode = vi.fn(() => Promise.resolve());

    globalThis.document = {
      createRange: () => ({
        selectNodeContents: vi.fn(),
        getBoundingClientRect: () => ({ width: 0 }),
      }),
      createElement: vi.fn(() => createCanvas()),
    };

    const controller = createPreviewController(elements, renderQrCode);

    await controller.updateCard(
      { name: "Short Name", phone: "08123456789", address: "Ciamis" },
      { qrEnabled: false },
    );

    const fontSizeWithoutQr = {
      name: elements.cardName.style.fontSize,
      phone: elements.cardPhone.style.fontSize,
      address: elements.cardAddress.style.fontSize,
    };

    await controller.updateCard(
      { name: "Short Name", phone: "08123456789", address: "Ciamis" },
      { qrEnabled: true },
    );

    expect(elements.qrSection.classList.contains("hidden")).toBe(false);
    expect(elements.cardName.style.fontSize).toBe(fontSizeWithoutQr.name);
    expect(elements.cardPhone.style.fontSize).toBe(fontSizeWithoutQr.phone);
    expect(elements.cardAddress.style.fontSize).toBe(fontSizeWithoutQr.address);
  });
});
