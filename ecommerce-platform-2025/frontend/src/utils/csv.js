export function exportToCSV(filename, rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    alert("Nothing to export");
    return;
  }

  const headers = Array.from(new Set(rows.flatMap(r => Object.keys(r))));

  const esc = (val) => {
    const s = String(val ?? "");
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };

  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => esc(r[h])).join(","))
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
