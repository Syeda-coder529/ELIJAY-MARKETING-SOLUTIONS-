import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FadeUp } from "@/components/site/motion-wrap";
import { ContactForm } from "@/components/forms/contact-form";

export default function ContactPage() {
  return (
    <div className="bg-hero-gradient">
      <div className="container py-20">
        <FadeUp className="mx-auto max-w-xl text-center">
          <Badge className="mb-4">Get in Touch</Badge>
          <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-muted">
            Questions about publishing, buying, or the network in general —
            reach out and our team will follow up shortly.
          </p>
        </FadeUp>

        <FadeUp delay={0.1} className="mx-auto mt-12 max-w-xl">
          <Card>
            <CardContent className="p-6 md:p-8">
              <ContactForm />
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    </div>
  );
}
