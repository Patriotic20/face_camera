import ExcelJS from 'exceljs';
import type { AttendanceRecord } from '../types/attendance';
import { calculateLateness } from './lateness';

export async function exportToExcel(
  records: AttendanceRecord[],
  workStart: string,
  filename: string,
): Promise<void> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Davomat');

  ws.columns = [
    { header: 'Sana', key: 'date', width: 14 },
    { header: 'Foydalanuvchi', key: 'userName', width: 25 },
    { header: 'Kirish', key: 'checkIn', width: 10 },
    { header: 'Kirish kamerasi', key: 'enterCamera', width: 22 },
    { header: 'Chiqish', key: 'checkOut', width: 10 },
    { header: 'Chiqish kamerasi', key: 'exitCamera', width: 22 },
    { header: 'Holat', key: 'status', width: 22 },
  ];

  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE5E7EB' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'left' };

  for (const r of records) {
    const lateness = calculateLateness(r.checkIn, workStart);

    const row = ws.addRow({
      date: r.date,
      userName: r.userName,
      checkIn: r.checkIn,
      enterCamera: r.enterCameraName ?? '—',
      checkOut: r.checkOut ?? '—',
      exitCamera: r.exitCameraName ?? '—',
      status: lateness.label,
    });

    const statusCell = row.getCell('status');
    statusCell.font = {
      color: { argb: lateness.late ? 'FFB91C1C' : 'FF15803D' },
      bold: true,
    };
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
