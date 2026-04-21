const HEADER_ALIASES = {
  name: new Set(["nama", "name", "nama member"]),
  phone: new Set(["whatsapp", "wa", "no hp", "nomor", "nomor whatsapp", "phone"]),
  address: new Set(["alamat", "wilayah", "alamat / wilayah", "wilayah / alamat"]),
};

function normalizeHeaderCell(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isHeaderRow(cells) {
  const [name = "", phone = "", address = ""] = cells.map(normalizeHeaderCell);

  return (
    HEADER_ALIASES.name.has(name) &&
    HEADER_ALIASES.phone.has(phone) &&
    HEADER_ALIASES.address.has(address)
  );
}

function parseSpreadsheetRow(line) {
  return line.split("\t").map((cell) => cell.trim());
}

function getInvalidReason(cells) {
  const [name = "", , address = ""] = cells;

  if (!name && !address) {
    return "nama dan alamat kosong";
  }

  if (!name) {
    return "nama kosong";
  }

  if (!address) {
    return "alamat kosong";
  }

  return "format baris tidak valid";
}

export function parseBulkLine(line) {
  const cells = parseSpreadsheetRow(line);
  const [name = "", phone = "", address = ""] = cells;

  if (!name || !address) {
    return null;
  }

  return {
    name,
    phone,
    address,
  };
}

export function parseBulkRecords(rawData) {
  const rawLines = rawData
    .split(/\r?\n/)
    .map((line) => line.replace(/\r/g, ""))
    .filter((line) => line.trim().length > 0);

  const validRecords = [];
  const invalidRows = [];
  const invalidDetails = [];
  let skippedHeader = false;

  rawLines.forEach((line, index) => {
    const cells = parseSpreadsheetRow(line);

    if (index === 0 && isHeaderRow(cells)) {
      skippedHeader = true;
      return;
    }

    const record = parseBulkLine(line);

    if (record) {
      validRecords.push(record);
      return;
    }

    invalidRows.push(index + 1);
    invalidDetails.push({
      row: index + 1,
      reason: getInvalidReason(cells),
      raw: line,
    });
  });

  return {
    validRecords,
    invalidRows,
    invalidDetails,
    skippedHeader,
    totalRows: rawLines.length,
  };
}
