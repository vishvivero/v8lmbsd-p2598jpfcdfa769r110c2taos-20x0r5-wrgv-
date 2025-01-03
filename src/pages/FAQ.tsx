import { motion } from "framer-motion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Debtfreeo?",
      answer: "Debtfreeo is a comprehensive debt management platform that helps you track, plan, and strategize your debt repayment journey. We provide tools and insights to help you become debt-free faster."
    },
    {
      question: "How does the debt repayment calculator work?",
      answer: "Our calculator uses your debt information (balance, interest rate, minimum payment) to create personalized repayment plans. It supports multiple strategies like Avalanche (highest interest first) and Snowball (lowest balance first) methods."
    },
    {
      question: "Is my financial information secure?",
      answer: "Yes, we take security seriously. All data is encrypted and stored securely. We use industry-standard security protocols and never share your personal information with third parties."
    },
    {
      question: "Can I track multiple debts?",
      answer: "Yes, you can add and track multiple debts including credit cards, personal loans, student loans, and mortgages. Our platform helps you manage all your debts in one place."
    },
    {
      question: "How do I get started?",
      answer: "Simply create an account, add your debts, and choose your preferred repayment strategy. Our platform will guide you through the process and create a personalized plan for you."
    },
    {
      question: "What repayment strategies are available?",
      answer: "We offer several strategies including the Avalanche method (targeting highest interest rates first), Snowball method (paying off smallest debts first), and Balance method (proportional payments based on debt sizes)."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about Debtfreeo
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;