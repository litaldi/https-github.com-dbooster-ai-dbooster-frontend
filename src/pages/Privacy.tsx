
import { Badge } from '@/components/ui/badge';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">Legal</Badge>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Introduction</h2>
        <p>
          DBooster ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
          explains how we collect, use, disclose, and safeguard your information when you use our 
          database optimization platform.
        </p>

        <h2>Information We Collect</h2>
        <h3>Personal Information</h3>
        <p>We may collect personal information that you voluntarily provide to us when you:</p>
        <ul>
          <li>Create an account</li>
          <li>Connect your GitHub repositories</li>
          <li>Contact us for support</li>
          <li>Subscribe to our newsletter</li>
        </ul>

        <h3>Usage Data</h3>
        <p>We automatically collect certain information when you use our service:</p>
        <ul>
          <li>Query performance metrics</li>
          <li>Database connection metadata (no actual data)</li>
          <li>Usage analytics and feature interactions</li>
          <li>Error logs and debugging information</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and improve our optimization services</li>
          <li>Analyze query patterns to enhance our AI algorithms</li>
          <li>Send you technical updates and security notifications</li>
          <li>Provide customer support</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your 
          personal information against unauthorized access, alteration, disclosure, or destruction. 
          This includes encryption, secure data transmission, and regular security assessments.
        </p>

        <h2>Data Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
        <ul>
          <li>With your explicit consent</li>
          <li>To trusted service providers who assist us in operating our platform</li>
          <li>When required by law or to protect our rights</li>
        </ul>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Object to certain processing activities</li>
          <li>Export your data in a portable format</li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@dbooster.com" className="text-primary hover:underline">
            privacy@dbooster.com
          </a>.
        </p>
      </div>
    </div>
  );
}
