
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Database Engineer",
    company: "TechCorp",
    content: "DBooster helped us reduce our database costs by 40% while improving query performance. The AI recommendations were spot-on.",
    rating: 5,
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "CTO",
    company: "StartupXYZ",
    content: "The real-time monitoring caught performance issues before they affected our users. Game-changer for our team.",
    rating: 5,
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "DevOps Lead",
    company: "Enterprise Inc",
    content: "Implementation was seamless and the insights are incredibly valuable. Our database performance has never been better.",
    rating: 5,
    avatar: "/placeholder.svg"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers are saying about their experience with DBooster.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
