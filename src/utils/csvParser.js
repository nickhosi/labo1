export function parseCSV(csvString) {
  const lines = csvString.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map(line => {
    const values = line.split(",");
    return headers.reduce((object, header, index) => {
      object[header.trim()] = values[index].trim();
      return object;
    }, {});
  });
}
