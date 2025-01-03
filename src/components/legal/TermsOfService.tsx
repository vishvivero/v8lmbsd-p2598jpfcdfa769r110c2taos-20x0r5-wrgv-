import { motion } from "framer-motion";

const TermsOfService = () => {
  return (
    <div className="flex-1 w-full bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full container mx-auto px-4 py-16 space-y-16">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-xl text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm space-y-6"
            >
              {sections.map((section, index) => (
                <section key={index} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                  {section.content}
                </section>
              ))}

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">6. Contact Us</h2>
                <p className="text-gray-600">For legal inquiries, contact us at:</p>
                <p className="text-primary font-medium">contact@debtfreeo.com</p>
                <p className="text-gray-500 text-sm">Please include the subject line 'Legal'</p>
              </section>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

const sections = [
  {
    title: "1. Account Terms",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-gray-600">
        <li>You must provide accurate information when creating an account.</li>
        <li>You are responsible for maintaining account security.</li>
        <li>Notify us immediately of unauthorized account access.</li>
        <li>We reserve the right to suspend or terminate accounts for violations.</li>
      </ul>
    ),
  },
  {
    title: "2. Service Usage",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-gray-600">
        <li>Services are provided "as is" without warranties.</li>
        <li>We may modify or discontinue services at any time.</li>
        <li>You agree to use the platform responsibly and legally.</li>
        <li>You will not attempt to breach security measures.</li>
      </ul>
    ),
  },
  {
    title: "3. Payment Terms",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-gray-600">
        <li>All fees are exclusive of applicable taxes.</li>
        <li>Payments are non-refundable unless required by law.</li>
        <li>Pricing changes will be notified 30 days in advance.</li>
        <li>Late payments may result in service suspension.</li>
      </ul>
    ),
  },
  {
    title: "4. Liability",
    content: (
      <div className="space-y-4">
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>We are not liable for indirect damages, such as data loss or lost profits.</li>
          <li>Our liability is limited to fees paid for the services.</li>
          <li>Debtfreeo provides tools and guidance for debt management but does not guarantee financial outcomes. Users are solely responsible for the decisions they make based on the platform's suggestions.</li>
          <li>Debtfreeo does not provide financial or legal advice.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "5. Governing Law",
    content: (
      <p className="text-gray-600">
        These terms are governed by the laws of the United Kingdom.
      </p>
    ),
  },
];

export default TermsOfService;