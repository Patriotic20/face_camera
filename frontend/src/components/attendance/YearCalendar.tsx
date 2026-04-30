import MonthGrid from './MonthGrid';

type Props = {
  year: number;
};

export default function YearCalendar({ year }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }, (_, m) => (
        <MonthGrid key={m} year={year} month={m} />
      ))}
    </div>
  );
}
