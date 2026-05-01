import { useEffect, useState } from 'react';
import MonthGrid from './MonthGrid';
import { getAttendanceRecords } from '../../data/attendanceApi';
import type { AttendanceRecord } from '../../types/attendance';

type Props = {
  year: number;
};

export default function YearCalendar({ year }: Props) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const data = await getAttendanceRecords();
        setRecords(data);
      } catch (error) {
        console.error('Failed to fetch attendance records:', error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [year]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }, (_, m) => (
        <MonthGrid key={m} year={year} month={m} records={records} />
      ))}
    </div>
  );
}
