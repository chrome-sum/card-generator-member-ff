import { describe, expect, it } from "vitest";

import { parseBulkLine, parseBulkRecords } from "./bulk.js";

describe("parseBulkLine", () => {
  it("parses a valid spreadsheet row with an optional empty WhatsApp cell", () => {
    expect(parseBulkLine("Hasbi\t\tCiamis")).toEqual({
      name: "Hasbi",
      phone: "",
      address: "Ciamis",
    });
  });

  it("returns null when the name is empty", () => {
    expect(parseBulkLine("\t628123456789\tCiamis")).toBeNull();
  });

  it("returns null when the address is empty", () => {
    expect(parseBulkLine("Hasbi\t628123456789\t")).toBeNull();
  });
});

describe("parseBulkRecords", () => {
  it("parses tab-separated rows without a header", () => {
    const result = parseBulkRecords("Hasbi\t628123456789\tCiamis\nSinta\t\tTasikmalaya");

    expect(result).toEqual({
      validRecords: [
        { name: "Hasbi", phone: "628123456789", address: "Ciamis" },
        { name: "Sinta", phone: "", address: "Tasikmalaya" },
      ],
      invalidRows: [],
      invalidDetails: [],
      skippedHeader: false,
      totalRows: 2,
    });
  });

  it("skips a recognized header row", () => {
    const result = parseBulkRecords("Nama\tWhatsApp\tAlamat\nHasbi\t628123456789\tCiamis");

    expect(result.skippedHeader).toBe(true);
    expect(result.validRecords).toEqual([
      { name: "Hasbi", phone: "628123456789", address: "Ciamis" },
    ]);
    expect(result.invalidRows).toEqual([]);
    expect(result.invalidDetails).toEqual([]);
    expect(result.totalRows).toBe(2);
  });

  it("supports header aliases like WA and No HP", () => {
    const waHeader = parseBulkRecords("Nama\tWA\tAlamat\nHasbi\t628123456789\tCiamis");
    const noHpHeader = parseBulkRecords("Nama\tNo HP\tAlamat\nHasbi\t628123456789\tCiamis");

    expect(waHeader.skippedHeader).toBe(true);
    expect(noHpHeader.skippedHeader).toBe(true);
  });

  it("tracks invalid rows while ignoring blank lines", () => {
    const result = parseBulkRecords(
      "Nama\tWhatsApp\tAlamat\nHasbi\t628123456789\tCiamis\n\n\t08123\tBandung\nSinta\t\tTasikmalaya\nDina\t0812\t",
    );

    expect(result.validRecords).toEqual([
      { name: "Hasbi", phone: "628123456789", address: "Ciamis" },
      { name: "Sinta", phone: "", address: "Tasikmalaya" },
    ]);
    expect(result.invalidRows).toEqual([3, 5]);
    expect(result.invalidDetails).toEqual([
      { row: 3, reason: "nama kosong", raw: "\t08123\tBandung" },
      { row: 5, reason: "alamat kosong", raw: "Dina\t0812\t" },
    ]);
    expect(result.skippedHeader).toBe(true);
    expect(result.totalRows).toBe(5);
  });
});
