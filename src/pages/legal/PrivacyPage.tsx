
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';

export default function PrivacyPage() {
  return (
    <StandardPageLayout
      title="Privacy Policy"
      subtitle="Last updated: January 1, 2024"
      description="Your privacy is important to us. This policy explains how we collect, use, and protect your information."
      maxWidth="lg"
    >
      <div className="prose prose-lg max-w-none">
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you create an account, 
          connect your database, or contact us for support.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To provide and improve our services</li>
          <li>To analyze database performance and provide optimization recommendations</li>
          <li>To communicate with you about your account</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information 
          and database metadata. We are SOC2 Type II compliant and use encryption both 
          in transit and at rest.
        </p>

        <h2>Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information. 
          Contact us at privacy@dbooster.ai to exercise these rights.
        </p>
      </div>
    </StandardPageLayout>
  );
}
