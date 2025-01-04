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
      <div className="flex bg-white rounded-xl overflow-hidden shadow-lg">
        <button className="bg-[#34D399]/10 hover:bg-[#34D399]/20 text-[#34D399] px-4 flex items-center justify-center">
          <span className="writing-mode-vertical transform rotate-0">{title}</span>
        </button>
        <div className="flex-1 grid grid-cols-4 p-4 items-center">
          <div className="text-center">
            <div className="text-[#111827] text-2xl font-semibold mb-1">{writtenOff}</div>
            <div className="text-gray-600 text-sm">Total Balance</div>
          </div>
          <div className="text-center">
            <div className="text-[#111827] text-2xl font-semibold mb-1">{monthlyCost}</div>
            <div className="text-gray-600 text-sm">Monthly Payment</div>
          </div>
          <div className="text-center">
            <div className="text-[#111827] text-2xl font-semibold mb-1">
              {oneOffCost}
            </div>
            <div className="text-gray-600 text-sm">Interest Rate</div>
          </div>
          <div className="text-center">
            <div className="text-[#111827] text-2xl font-semibold mb-1">{months}</div>
            <div className="text-gray-600 text-sm">Months to Payoff</div>
          </div>
        </div>
      </div>
    </div>
  );
};