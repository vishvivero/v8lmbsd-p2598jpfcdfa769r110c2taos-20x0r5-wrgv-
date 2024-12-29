import { ScrollArea } from "@/components/ui/scroll-area";

export const DataProcessingAgreement = () => {
  return (
    <ScrollArea className="h-[70vh] w-full rounded-md border p-6 bg-white">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Data Processing Agreement</h2>
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">1. Data Processing Details</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Types of personal data processed</li>
            <li>Duration of processing</li>
            <li>Purpose of processing</li>
            <li>Categories of data subjects</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">2. Security Measures</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Technical security measures</li>
            <li>Organizational security measures</li>
            <li>Access controls</li>
            <li>Data encryption</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">3. Sub-processors</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>List of approved sub-processors</li>
            <li>Sub-processor obligations</li>
            <li>Changes to sub-processors</li>
            <li>Liability for sub-processors</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">4. Data Subject Rights</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Assistance with data subject requests</li>
            <li>Response timeframes</li>
            <li>Documentation of requests</li>
            <li>Cost allocation</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">5. Contact</h3>
          <p>For DPA related inquiries, contact us at:</p>
          <p>dpa@debtfreeo.com</p>
        </section>
      </div>
    </ScrollArea>
  );
};