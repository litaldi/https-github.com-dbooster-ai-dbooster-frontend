
export default function Pricing() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that's right for your team. All plans include our core optimization features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="border rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-2">Starter</h3>
            <p className="text-muted-foreground mb-4">Perfect for small projects</p>
            <div className="text-3xl font-bold mb-6">Free</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                Up to 3 repositories
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                1,000 queries per month
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                Basic optimization suggestions
              </li>
            </ul>
            <button className="w-full border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded">
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="border-2 border-primary rounded-lg p-8 relative">
            <div className="absolute -top-3 inset-x-0 flex justify-center">
              <span className="bg-primary text-white px-3 py-1 text-sm rounded-full">Most Popular</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-muted-foreground mb-4">Best for growing teams</p>
            <div className="text-3xl font-bold mb-6">$29<span className="text-base font-normal">/month</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                Up to 10 repositories
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                50,000 queries per month
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                Advanced AI optimization
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                Performance monitoring
              </li>
            </ul>
            <button className="w-full bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded">
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="border rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
            <p className="text-muted-foreground mb-4">For large organizations</p>
            <div className="text-3xl font-bold mb-6">Custom</div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                Unlimited repositories
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                Unlimited queries
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                Custom integrations
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2" />
                24/7 priority support
              </li>
            </ul>
            <button className="w-full border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
