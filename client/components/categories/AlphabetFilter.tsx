'use client';
import { Search } from "lucide-react";

const letters = ["ALL","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

interface Props {
  activeLetter: string;
  onLetterChange: (l: string) => void;
  columns: number;
  onColumnsChange: (c: number) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export default function AlphabetFilter({ activeLetter, onLetterChange, columns, onColumnsChange, search, onSearchChange }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">All Categories</h2>
        <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
          {[2, 3].map((col) => (
            <button
              key={col}
              title={`${col} Columns`}
              onClick={() => onColumnsChange(col)}
              className={`p-2 transition-colors flex items-center gap-[2px] sm:hidden ${columns === col ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {Array.from({ length: col }).map((_, i) => (
                <span key={i} className="block w-[3px] h-3.5 rounded-[1px]" style={{ backgroundColor: columns === col ? '#fff' : '#9ca3af' }} />
              ))}
            </button>
          ))}
          {[3, 4, 5].map((col) => (
            <button
              key={col}
              title={`${col} Columns`}
              onClick={() => onColumnsChange(col)}
              className={`p-2 transition-colors items-center gap-[2px] hidden sm:flex ${columns === col ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {Array.from({ length: col }).map((_, i) => (
                <span key={i} className="block w-[3px] h-3.5 rounded-[1px]" style={{ backgroundColor: columns === col ? '#fff' : '#9ca3af' }} />
              ))}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap overflow-x-auto">
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() => onLetterChange(letter)}
              className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors shrink-0 ${
                activeLetter === letter
                  ? "bg-primary text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          <input
            placeholder="Search by categories name"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 text-xs border border-gray-200 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none px-3"
          />
        </div>
      </div>
    </div>
  );
}
