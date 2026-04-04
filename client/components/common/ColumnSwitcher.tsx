'use client';

interface ColumnSwitcherProps {
  columns: number;
  onChange: (cols: number) => void;
  mobileOptions?: number[];
  desktopOptions?: number[];
}

export default function ColumnSwitcher({ columns, onChange, mobileOptions = [2, 3], desktopOptions = [3, 4, 5] }: ColumnSwitcherProps) {
  return (
    <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
      {mobileOptions.map((col) => (
        <button
          key={`m-${col}`}
          title={`${col} Columns`}
          onClick={() => onChange(col)}
          className={`p-2 transition-colors flex items-center gap-[2px] sm:hidden ${columns === col ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          {Array.from({ length: col }).map((_, i) => (
            <span key={i} className="block w-[3px] h-3.5 rounded-[1px]" style={{ backgroundColor: columns === col ? '#fff' : '#9ca3af' }} />
          ))}
        </button>
      ))}
      {desktopOptions.map((col) => (
        <button
          key={`d-${col}`}
          title={`${col} Columns`}
          onClick={() => onChange(col)}
          className={`p-2 transition-colors items-center gap-[2px] hidden sm:flex ${columns === col ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          {Array.from({ length: col }).map((_, i) => (
            <span key={i} className="block w-[3px] h-3.5 rounded-[1px]" style={{ backgroundColor: columns === col ? '#fff' : '#9ca3af' }} />
          ))}
        </button>
      ))}
    </div>
  );
}
