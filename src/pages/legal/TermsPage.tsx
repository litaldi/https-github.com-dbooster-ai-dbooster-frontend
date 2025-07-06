
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';

export default function TermsPage() {
  return (
    <StandardPageLayout
      title="Terms of Service"
      subtitle="Last updated: January 1, 2024"
      description="Please read these Terms of Service carefully before using DBooster."
      maxWidth="lg"
    >
      <div className="prose prose-lg max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using DBooster, you accept and agree to be bound by the terms 
          and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use DBooster for personal, non-commercial 
          transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>

        <h2>3. Data Protection</h2>
        <p>
          We are committed to protecting your data. All database connections use read-only 
          access, and we implement industry-standard security measures.
        </p>

        <h2>4. Service Availability</h2>
        <p>
          We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. 
          Scheduled maintenance will be announced in advance.
        </p>

        <h2>5. Contact Information</h2>
        <p>
          Questions about the Terms of Service should be sent to us at legal@dbooster.ai
        </p>
      </div>
    </StandardPageLayout>
  );
}
