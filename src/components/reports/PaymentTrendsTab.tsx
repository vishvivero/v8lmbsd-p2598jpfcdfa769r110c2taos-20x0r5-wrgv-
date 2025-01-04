export interface PaymentTrendsTabProps {
  payments: {
    id: string;
    user_id: string;
    total_payment: number;
    payment_date: string;
    created_at: string;
    currency_symbol: string;
  }[];
  handleDownloadReport: (reportType: string) => void;
}

export function PaymentTrendsTab({ payments, handleDownloadReport }: PaymentTrendsTabProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Payment Trends</h2>
      <button onClick={() => handleDownloadReport("payment trends")} className="mt-4 mb-2">
        Download Report
      </button>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">User ID</th>
            <th className="border border-gray-300 p-2">Total Payment</th>
            <th className="border border-gray-300 p-2">Payment Date</th>
            <th className="border border-gray-300 p-2">Created At</th>
            <th className="border border-gray-300 p-2">Currency Symbol</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="border border-gray-300 p-2">{payment.id}</td>
              <td className="border border-gray-300 p-2">{payment.user_id}</td>
              <td className="border border-gray-300 p-2">{payment.total_payment}</td>
              <td className="border border-gray-300 p-2">{payment.payment_date}</td>
              <td className="border border-gray-300 p-2">{payment.created_at}</td>
              <td className="border border-gray-300 p-2">{payment.currency_symbol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
