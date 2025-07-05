
export default function Privacy() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, 
              upload database schemas, or contact us for support.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, 
              process transactions, and communicate with you.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide services and fulfill 
              the purposes outlined in this policy, unless a longer retention period is required by law.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@dbooster.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
