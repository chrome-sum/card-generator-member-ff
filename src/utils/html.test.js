import { describe, expect, it } from "vitest";

import { escapeHtml } from "./html.js";

describe("escapeHtml", () => {
  it("escapes HTML-special characters in user-provided text", () => {
    expect(escapeHtml(`<img src="x" onerror="alert('xss')">`)).toBe(
      "&lt;img src=&quot;x&quot; onerror=&quot;alert(&#39;xss&#39;)&quot;&gt;",
    );
  });

  it("escapes ampersands before other characters", () => {
    expect(escapeHtml("A & B < C > D")).toBe("A &amp; B &lt; C &gt; D");
  });
});
