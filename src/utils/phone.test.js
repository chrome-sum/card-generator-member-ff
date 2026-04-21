import { describe, expect, it } from "vitest";

import { formatPhone, normalizePhone } from "./phone.js";

describe("normalizePhone", () => {
  it("removes non-digit characters", () => {
    expect(normalizePhone("+62 812-3456-789")).toBe("628123456789");
  });

  it("converts leading zero to Indonesian country code", () => {
    expect(normalizePhone("08123456789")).toBe("628123456789");
  });

  it("returns an empty string for empty input", () => {
    expect(normalizePhone("")).toBe("");
  });
});

describe("formatPhone", () => {
  it("formats a normalized Indonesian number", () => {
    expect(formatPhone("628123456789")).toBe("+62 812-3456-789");
  });

  it("formats an already local number after normalization", () => {
    expect(formatPhone("081234567890")).toBe("+62 812-3456-7890");
  });

  it("returns an empty string when there is no number", () => {
    expect(formatPhone("")).toBe("");
  });
});
