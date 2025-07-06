
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export function SocialProofSection() {
  const testimonials = [
    {
      quote: "DBooster reduced our query response times by 73% in the first month. The AI recommendations were spot-on.",
      author: "Sarah Chen",
      role: "Senior Database Engineer",
      company: "TechCorp",
      rating: 5
    },
    {
      quote: "The automated optimization suggestions transformed how we manage database performance. It's like having experts 24/7.",
      author: "Michael Rodriguez",
      role: "CTO",
      company: "StartupXYZ",
      rating: 5
    },
    {
      quote: "Cost savings were immediate. We cut our infrastructure bills by 60% within two months of using DBooster.",
      author: "Lisa Wang",
      role: "DevOps Lead",
      company: "Enterprise Inc",
      rating: 5
    }
  ];

  const trustedBy = [
    "TechCorp", "StartupXYZ", "Enterprise Inc", "DataFlow", "CloudTech", "ScaleUp"
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Trusted By */}
        <div className="text-center mb-16">
          <p className="text-sm text-muted-foreground mb-8">Trusted by 50,000+ developers worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {trustedBy.map((company, index) => (
              <div key={index} className="text-lg font-semibold text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground">Real results from real customers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-muted/30 p-6 rounded-lg relative"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.quote}"
              </p>
              
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
