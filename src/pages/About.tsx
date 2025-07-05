
export default function About() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8">About DBooster</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg">
              We're on a mission to make database optimization accessible to every developer and organization. 
              Our AI-powered platform helps teams reduce costs by up to 60% while improving performance by 73%.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground text-lg">
              Founded by database experts and AI researchers, DBooster was born from the frustration of 
              spending countless hours manually optimizing database queries. We believe that with the right 
              tools, database optimization should be automatic, intelligent, and accessible to everyone.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Why Choose DBooster?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3" />
                <span className="text-muted-foreground">
                  Trusted by over 10,000 developers worldwide
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3" />
                <span className="text-muted-foreground">
                  SOC2 Type II certified for enterprise security
                </span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3" />
                <span className="text-muted-foreground">
                  24/7 customer support and expert consultation
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
