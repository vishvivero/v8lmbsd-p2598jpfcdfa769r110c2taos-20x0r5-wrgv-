import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { LegalFooter } from "@/components/legal/LegalFooter";

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
      answer: "Yes, we take security extremely seriously. Debtfreeo is built using Lovable's secure web development platform and leverages Supabase's enterprise-grade security infrastructure. Our application uses bank-level encryption (AES-256), implements strict Row-Level Security (RLS) policies, and follows best practices for data protection. We never store sensitive information like bank account details, and all user data is encrypted both in transit and at rest.",
    },
    {
      question: "Can I use Debtfreeo outside the UK?",
      answer: "Yes! Debtfreeo is a global platform accessible to users worldwide. Our debt management tools and strategies are universally applicable to help you achieve financial freedom.",
    },
    {
      question: "Is Debtfreeo really free?",
      answer: "Yes! During our beta phase, all premium features are available for free. This includes access to advanced debt repayment strategies, detailed analytics, and progress tracking tools.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12 mt-8">
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
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100 w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link to="/" className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">
                Debtfreeo
              </Link>
              <p className="text-gray-600">
                Your journey to financial freedom starts here.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to="/tools" className="hover:text-primary transition-colors">
                    Free Tools
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link to="/about" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <LegalFooter />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 Debtfreeo. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default FAQ;