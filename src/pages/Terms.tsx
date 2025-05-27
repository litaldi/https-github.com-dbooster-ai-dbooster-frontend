
import { Badge } from '@/components/ui/badge';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-4">Legal</Badge>
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Agreement to Terms</h2>
        <p>
          By accessing and using DBooster, you accept and agree to be bound by the terms and 
          provision of this agreement. If you do not agree to abide by the above, please do 
          not use this service.
        </p>

        <h2>Description of Service</h2>
        <p>
          DBooster provides AI-powered database query optimization services. Our platform analyzes 
          SQL queries and provides recommendations to improve database performance.
        </p>

        <h2>User Accounts</h2>
        <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:</p>
        <ul>
          <li>Safeguarding your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized use</li>
        </ul>

        <h2>Acceptable Use</h2>
        <p>You agree not to use DBooster to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Transmit malicious code or compromise system security</li>
          <li>Attempt to reverse engineer our optimization algorithms</li>
          <li>Use the service for any unlawful or prohibited purpose</li>
        </ul>

        <h2>Data and Privacy</h2>
        <p>
          We analyze query structures and performance metrics but do not store or access your 
          actual database content. All analysis is performed on metadata and query patterns only.
        </p>

        <h2>Service Availability</h2>
        <p>
          While we strive for high availability, we do not guarantee that our service will be 
          available 100% of the time. Scheduled maintenance, updates, and unforeseen technical 
          issues may cause temporary service interruptions.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          DBooster shall not be liable for any indirect, incidental, special, consequential, or 
          punitive damages, including without limitation, loss of profits, data, use, goodwill, 
          or other intangible losses.
        </p>

        <h2>Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, 
          for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any 
          time. If a revision is material, we will try to provide at least 30 days notice prior 
          to any new terms taking effect.
        </p>

        <h2>Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at{' '}
          <a href="mailto:legal@dbooster.com" className="text-primary hover:underline">
            legal@dbooster.com
          </a>.
        </p>
      </div>
    </div>
  );
}
