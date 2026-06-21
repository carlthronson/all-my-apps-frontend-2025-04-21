// lib/exportTransactionsCsv.ts
export type CsvRow = {
  date: string;
  description: string;
  amount: number | string;
};

function escapeCsv(value: unknown): string {
  const s = String(value ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export function downloadTransactionsCsv(rows: CsvRow[], fileName = "transactions.csv") {
  const header = ["date", "description", "amount"];

  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [row.date, row.description, row.amount].map(escapeCsv).join(",")
    ),
  ];

  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
