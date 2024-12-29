import { ScrollArea } from "@/components/ui/scroll-area";

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ScrollArea className="h-[80vh] w-full rounded-lg border bg-white/50 backdrop-blur-sm shadow-sm">
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600">These Terms of Service govern your use of Debtfreeo. By using our platform, you agree to these terms.</p>
          </div>

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
        </div>
      </ScrollArea>
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
