import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Debtfreeo?",
      answer: "Debtfreeo is a comprehensive debt management platform that helps users track their debts, explore different repayment strategies (like Avalanche and Snowball methods), and achieve financial freedom. Our platform is secure, user-friendly, and currently free during the beta phase.",
    },
    {
      question: "How does the debt avalanche method work?",
      answer: "The debt avalanche method involves paying off debts in order of highest to lowest interest rate, while making minimum payments on all other debts. This strategy helps minimize the total interest paid and can lead to faster debt repayment.",
    },
    {
      question: "Is my financial information secure?",
      answer: "Yes, we take security seriously. Debtfreeo uses bank-level encryption to protect your data, and we never store sensitive information like bank account details. Our platform is built with industry-standard security practices to ensure your information remains private and secure.",
    },
    {
      question: "Can I use Debtfreeo outside the UK?",
      answer: "While Debtfreeo is founded in the UK, our platform is accessible globally. Users from any country can use our tools to manage their debt repayment journey. However, some features may be optimized for UK users.",
    },
    {
      question: "Is Debtfreeo really free?",
      answer: "Yes! During our beta phase, all premium features are available for free. This includes access to advanced debt repayment strategies, detailed analytics, and progress tracking tools.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 mb-12">
          Find answers to common questions about Debtfreeo and our debt management tools.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="bg-white rounded-lg shadow-sm">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <span className="text-left font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
};

export default FAQ;