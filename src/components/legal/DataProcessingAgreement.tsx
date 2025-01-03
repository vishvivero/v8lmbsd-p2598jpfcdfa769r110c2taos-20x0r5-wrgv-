import { ScrollArea } from "@/components/ui/scroll-area";

const DataProcessingAgreement = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ScrollArea className="h-[80vh] w-full rounded-lg border bg-white/50 backdrop-blur-sm shadow-sm">
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Data Processing Agreement</h1>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600">
              This Data Processing Agreement (DPA) outlines how Debtfreeo processes and protects personal data in compliance with applicable laws, including GDPR.
            </p>
          </div>

          {sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              {section.content}
            </section>
          ))}

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">7. Contact Us</h2>
            <p className="text-gray-600">For DPA-related inquiries, contact us at:</p>
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
    title: "1. Data Processing Details",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-gray-600">
        <li><span className="font-medium">Data Types:</span> Email address, debt-related information, and payment details.</li>
        <li><span className="font-medium">Purpose:</span> To provide debt management services.</li>
        <li><span className="font-medium">Duration:</span> Data is processed only as long as necessary for service delivery.</li>
        <li><span className="font-medium">Data Subjects:</span> Users of Debtfreeo.</li>
      </ul>
    ),
  },
  {
    title: "2. Security Measures",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">We implement:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li><span className="font-medium">Technical Security Measures:</span> Data encryption (e.g., AES-256), secure backups.</li>
          <li><span className="font-medium">Organizational Measures:</span> Staff training, regular security audits.</li>
          <li><span className="font-medium">Access Controls:</span> Restricting access to authorized personnel only.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "3. Sub-processors",
    content: (
      <ul className="list-disc pl-6 space-y-2 text-gray-600">
        <li><span className="font-medium">List of Approved Sub-processors:</span> Available upon request.</li>
        <li><span className="font-medium">Obligations:</span> Sub-processors are required to meet the same data protection standards.</li>
        <li><span className="font-medium">Changes:</span> We will notify you 30 days in advance of any changes to sub-processors.</li>
      </ul>
    ),
  },
  {
    title: "4. Data Subject Rights",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">We assist with:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Responding to access, correction, and deletion requests.</li>
          <li>Meeting response timeframes in compliance with GDPR.</li>
          <li>Providing documentation of requests.</li>
          <li>Allocating costs where applicable.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "5. Disclaimer",
    content: (
      <p className="text-gray-600">
        While Debtfreeo supports compliance with data protection regulations, we do not assume liability for the actions of users or third parties. It is the responsibility of users to ensure their use of the platform aligns with applicable laws.
      </p>
    ),
  },
  {
    title: "6. Governing Law",
    content: (
      <p className="text-gray-600">
        This DPA is governed by the laws of the United Kingdom.
      </p>
    ),
  },
];

export default DataProcessingAgreement;
