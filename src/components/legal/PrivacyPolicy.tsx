import { ScrollArea } from "@/components/ui/scroll-area";

export const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ScrollArea className="h-[80vh] w-full rounded-lg border bg-white/50 backdrop-blur-sm shadow-sm">
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600">Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use Debtfreeo.</p>
          </div>

          {sections.map((section, index) => (
            <section key={index} className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              {section.content}
            </section>
          ))}

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">8. Contact Us</h2>
            <p className="text-gray-600">For privacy-related inquiries, contact us at:</p>
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
    title: "1. Data Collection",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">We collect the following information:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li><span className="font-medium">Email Address:</span> For account creation and communication.</li>
          <li><span className="font-medium">Debt-Related Information:</span> Such as balances and interest rates, to provide our services.</li>
          <li><span className="font-medium">Payment Information:</span> For processing transactions.</li>
          <li><span className="font-medium">Usage Data:</span> For improving our services, including analytics and cookies.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "2. Data Usage",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">Your data is used to:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Provide debt management services.</li>
          <li>Process payments securely.</li>
          <li>Send important notifications and updates.</li>
          <li>Improve our platform's features and performance.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "3. Data Sharing",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">We may share your data with:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Third-party service providers (e.g., payment processors, analytics tools) who meet strict data protection standards.</li>
          <li>Legal authorities, if required by law.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "4. Data Protection",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">We implement the following measures to protect your data:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Encryption of sensitive information (e.g., AES-256).</li>
          <li>Regular security audits.</li>
          <li>Access controls and authentication protocols.</li>
          <li>Secure data storage.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "5. Your Rights",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li><span className="font-medium">Access:</span> Request access to your personal data.</li>
          <li><span className="font-medium">Correction:</span> Request corrections to inaccurate data.</li>
          <li><span className="font-medium">Deletion:</span> Request deletion of your data.</li>
          <li><span className="font-medium">Withdraw Consent:</span> Revoke permissions for specific processing activities.</li>
          <li><span className="font-medium">Data Portability:</span> Obtain a copy of your data in a machine-readable format.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "6. Data Retention",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">We retain your personal data as long as necessary to:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Provide our services.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "7. Disclaimer",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600">
          Debtfreeo provides tools and strategies for debt management, but the decisions you make based on the platform are solely your responsibility. We do not provide financial or legal advice, and we cannot be held liable for any outcomes resulting from the use of our services.
        </p>
      </div>
    ),
  },
];