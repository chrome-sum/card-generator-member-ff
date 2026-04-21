export function parseBulkLine(line, fallbackAddress) {
  const parts = line.split(",").map((part) => part.trim());

  if (parts.length < 2 || !parts[0] || !parts[1]) {
    return null;
  }

  return {
    name: parts[0],
    phone: parts[1],
    address: parts.slice(2).join(", ").trim() || fallbackAddress,
  };
}

export function parseBulkRecords(rawData, fallbackAddress) {
  const lines = rawData
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const validRecords = [];
  const invalidLines = [];

  lines.forEach((line, index) => {
    const record = parseBulkLine(line, fallbackAddress);

    if (record) {
      validRecords.push(record);
      return;
    }

    invalidLines.push(index + 1);
  });

  return { validRecords, invalidLines };
}
