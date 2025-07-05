
export default function Accessibility() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Accessibility Statement</h1>
        
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment</h2>
            <p>
              DBooster is committed to ensuring digital accessibility for people with disabilities. 
              We are continually improving the user experience for everyone and applying the relevant 
              accessibility standards.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Conformance Status</h2>
            <p>
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. 
              These guidelines explain how to make web content more accessible to people with disabilities.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Accessibility Features</h2>
            <ul className="space-y-2">
              <li>• Keyboard navigation support</li>
              <li>• Screen reader compatibility</li>
              <li>• High contrast mode support</li>
              <li>• Scalable text and interface elements</li>
              <li>• Alternative text for images</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Feedback</h2>
            <p>
              We welcome your feedback on the accessibility of DBooster. Please let us know if you 
              encounter accessibility barriers by contacting us at accessibility@dbooster.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
