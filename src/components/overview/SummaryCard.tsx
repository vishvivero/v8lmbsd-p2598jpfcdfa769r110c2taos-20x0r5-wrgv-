import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SummaryCardProps {
  id: string;
  title: string;
  writtenOff: string;
  monthlyCost: string;
  oneOffCost: string;
  months: string | number;
}

export const SummaryCard = ({
  id,
  title,
  writtenOff,
  monthlyCost,
  oneOffCost,
  months,
}: SummaryCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative mb-4">
      <div 
        onClick={() => navigate(`/overview/debt/${id}`)}
        className="flex bg-white hover:bg-[#34D399]/10 transition-colors duration-200 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
      >
        <div className="bg-[#34D399]/10 group-hover:bg-[#34D399]/20 text-[#34D399] px-4 flex items-center justify-center">
          <span className="writing-mode-vertical transform rotate-0">{title}</span>
        </div>
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