import { ScrollArea } from "@/components/ui/scroll-area";

export const TermsOfService = () => {
  return (
    <ScrollArea className="h-[70vh] w-full rounded-md border p-6 bg-white">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Terms of Service</h2>
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">1. Account Terms</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate information when creating an account</li>
            <li>You are responsible for maintaining account security</li>
            <li>You must notify us of any unauthorized account access</li>
            <li>We reserve the right to suspend or terminate accounts</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">2. Service Usage</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Services are provided "as is" without warranties</li>
            <li>We may modify or discontinue services at any time</li>
            <li>You agree to use services legally and responsibly</li>
            <li>You will not attempt to breach security measures</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">3. Payment Terms</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>All fees are exclusive of taxes</li>
            <li>Payments are non-refundable unless required by law</li>
            <li>We may change pricing with 30 days notice</li>
            <li>Late payments may result in service suspension</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">4. Liability</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>We are not liable for indirect damages</li>
            <li>Our liability is limited to fees paid</li>
            <li>You indemnify us against third-party claims</li>
            <li>We do not provide financial advice</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">5. Contact</h3>
          <p>For legal inquiries, contact us at:</p>
          <p>legal@debtfreeo.com</p>
        </section>
      </div>
    </ScrollArea>
  );
};