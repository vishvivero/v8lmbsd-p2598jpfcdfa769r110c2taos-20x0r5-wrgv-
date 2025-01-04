import React from 'react';

interface SummaryCardProps {
  title: string;
  writtenOff: string;
  monthlyCost: string;
  oneOffCost: string;
  months: string | number;
}

export const SummaryCard = ({
  title,
  writtenOff,
  monthlyCost,
  oneOffCost,
  months,
}: SummaryCardProps) => {
  return (
    <div className="relative mb-4">
      <h3 className="text-indigo-900 text-lg font-medium mb-2">{title}</h3>
      <div className="flex bg-[#0A0F2C] rounded-xl overflow-hidden">
        <div className="flex-1 grid grid-cols-4 p-4 items-center">
          <div className="text-center">
            <div className="text-[#34D399] text-2xl font-semibold mb-1">{writtenOff}</div>
            <div className="text-gray-300 text-sm">Written off</div>
          </div>
          <div className="text-center">
            <div className="text-[#34D399] text-2xl font-semibold mb-1">{monthlyCost}</div>
            <div className="text-gray-300 text-sm">Monthly cost</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-semibold mb-1 ${oneOffCost === 'N/A' ? 'text-[#34D399]' : 'text-red-400'}`}>
              {oneOffCost}
            </div>
            <div className="text-gray-300 text-sm">One off cost</div>
          </div>
          <div className="text-center">
            <div className="text-[#34D399] text-2xl font-semibold mb-1">{months}</div>
            <div className="text-gray-300 text-sm">Months</div>
          </div>
        </div>
        <button className="bg-[#B4FFE7] hover:bg-[#A0FFE0] text-[#0A0F2C] px-4 flex items-center justify-center">
          <span className="writing-mode-vertical transform rotate-180">More Info</span>
        </button>
      </div>
    </div>
  );
};