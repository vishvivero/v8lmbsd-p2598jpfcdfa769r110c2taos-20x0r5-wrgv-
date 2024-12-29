import { ScrollArea } from "@/components/ui/scroll-area";

export const PrivacyPolicy = () => {
  return (
    <ScrollArea className="h-[70vh] w-full rounded-md border p-6 bg-white">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Privacy Policy</h2>
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">1. Data Collection</h3>
          <p>We collect the following information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email address for account creation and communication</li>
            <li>Debt-related information for providing our services</li>
            <li>Payment information for processing transactions</li>
            <li>Usage data to improve our services</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">2. Data Usage</h3>
          <p>Your data is used to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide debt management services</li>
            <li>Process payments</li>
            <li>Send important notifications</li>
            <li>Improve our services</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">3. Data Protection</h3>
          <p>We implement security measures to protect your data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of sensitive information</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
            <li>Secure data storage</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">4. Your Rights</h3>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Request data correction</li>
            <li>Request data deletion</li>
            <li>Withdraw consent</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">5. Contact Us</h3>
          <p>For any privacy-related queries, contact us at:</p>
          <p>privacy@debtfreeo.com</p>
        </section>
      </div>
    </ScrollArea>
  );
};