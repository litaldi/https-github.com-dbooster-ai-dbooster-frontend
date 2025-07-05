
export default function Contact() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have questions about DBooster? We'd love to hear from you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">support@dbooster.com</p>
              </div>
              <div>
                <h3 className="font-medium">Sales</h3>
                <p className="text-muted-foreground">sales@dbooster.com</p>
              </div>
              <div>
                <h3 className="font-medium">Support</h3>
                <p className="text-muted-foreground">Available 24/7 for Enterprise customers</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                placeholder="Your message..."
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
              />
              <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
