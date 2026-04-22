import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockToPng,
  mockSaveAs,
  zipFile,
  zipGenerateAsync,
} = vi.hoisted(() => ({
  mockToPng: vi.fn(),
  mockSaveAs: vi.fn(),
  zipFile: vi.fn(),
  zipGenerateAsync: vi.fn(),
}));

vi.mock("html-to-image", () => ({
  toPng: mockToPng,
}));

vi.mock("file-saver", () => ({
  saveAs: mockSaveAs,
}));

vi.mock("jszip", () => ({
  default: vi.fn().mockImplementation(() => ({
    file: zipFile,
    generateAsync: zipGenerateAsync,
  })),
}));

vi.mock("../utils/time.js", () => ({
  wait: vi.fn(() => Promise.resolve()),
}));

import { createExportController } from "./export.js";

function createClassList(initialClasses = []) {
  const classes = new Set(initialClasses);

  return {
    add: (...tokens) => tokens.forEach((token) => classes.add(token)),
    remove: (...tokens) => tokens.forEach((token) => classes.delete(token)),
    contains: (token) => classes.has(token),
  };
}

function createElements() {
  return {
    card: {},
    btnSingle: {
      innerText: "Download Card (PNG)",
      disabled: false,
    },
    progressArea: {
      classList: createClassList(["hidden"]),
    },
    progressBar: {
      style: {
        width: "",
      },
    },
    progressText: {
      innerText: "",
    },
    singleStatus: {
      textContent: "",
      classList: createClassList(["hidden"]),
    },
    bulkStatus: {
      textContent: "",
      classList: createClassList(["hidden"]),
    },
  };
}

function createPreviewController() {
  return {
    prepareForExport: vi.fn(),
    restoreAfterExport: vi.fn(),
    updateCard: vi.fn(() => Promise.resolve()),
  };
}

function createStateManager(overrides = {}) {
  const state = {
    singleMember: { name: "Hasbi", phone: "08123", address: "Ciamis" },
    singleQrEnabled: true,
    isSingleExporting: false,
    bulkRawData: "Hasbi\t08123\tCiamis",
    bulkQrEnabled: false,
    bulkParseResult: {
      validRecords: [{ name: "Hasbi", phone: "08123", address: "Ciamis" }],
      invalidRows: [],
      invalidDetails: [],
      skippedHeader: false,
      totalRows: 1,
    },
    isBulkExporting: false,
    ...overrides,
  };

  return {
    getState: vi.fn(() => structuredClone(state)),
    setSingleExporting: vi.fn((value) => {
      state.isSingleExporting = value;
    }),
    setBulkExporting: vi.fn((value) => {
      state.isBulkExporting = value;
    }),
  };
}

describe("createExportController", () => {
  const originalDocument = globalThis.document;

  beforeEach(() => {
    mockToPng.mockReset();
    mockSaveAs.mockReset();
    zipFile.mockReset();
    zipGenerateAsync.mockReset();
    zipGenerateAsync.mockResolvedValue(new Blob(["zip"]));
  });

  afterEach(() => {
    globalThis.document = originalDocument;
  });

  it("falls back when document.fonts.ready is unavailable during single export", async () => {
    const elements = createElements();
    const previewController = createPreviewController();
    const stateManager = createStateManager();
    const click = vi.fn();

    mockToPng.mockResolvedValue("data:image/png;base64,abc");
    globalThis.document = {
      createElement: vi.fn(() => ({
        click,
      })),
    };

    const controller = createExportController(elements, previewController, stateManager);

    await controller.exportSinglePNG();

    expect(stateManager.setSingleExporting).toHaveBeenNthCalledWith(1, true);
    expect(stateManager.setSingleExporting).toHaveBeenNthCalledWith(2, false);
    expect(previewController.prepareForExport).toHaveBeenCalledTimes(1);
    expect(previewController.restoreAfterExport).toHaveBeenCalledTimes(1);
    expect(mockToPng).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("blocks bulk export when another export is already running", async () => {
    const elements = createElements();
    const previewController = createPreviewController();
    const stateManager = createStateManager({ isSingleExporting: true });

    globalThis.document = {
      fonts: {
        ready: Promise.resolve(),
      },
      createElement: vi.fn(),
    };

    const controller = createExportController(elements, previewController, stateManager);

    await controller.exportBulkZip();

    expect(elements.bulkStatus.textContent).toBe(
      "Export sedang berjalan. Tunggu proses sebelumnya selesai.",
    );
    expect(stateManager.setBulkExporting).not.toHaveBeenCalled();
    expect(previewController.prepareForExport).not.toHaveBeenCalled();
    expect(mockSaveAs).not.toHaveBeenCalled();
  });
});
