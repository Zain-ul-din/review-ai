import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Container, Section } from "../craft";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const faqs = [
  {
    question: "Is it free?",
    answer:
      "Yes! Reviews Plethora is free to use unless you're collecting a high volume of reviews, in which case you can explore our affordable premium plans.",
  },
  {
    question: "Can I export my reviews?",
    answer:
      "Yes! With just a single click, you can export all of your reviews in a convenient format, making it easy to analyze or showcase them wherever you need.",
  },
  {
    question: "Can I verify the authenticity of the reviews?",
    answer:
      "Yes, every review is verified by authenticating the user through their Google or email account, ensuring that you only receive genuine feedback.",
  },
  {
    question: "What if I want users to submit reviews without logging in?",
    answer:
      "To make the process easier for users, you can send them a magic link, allowing them to submit reviews without needing to log in.",
  },
  {
    question: "Can i use magic links?",
    answer:
      "Magic links aren’t supported yet, but we’re working on adding them soon. Stay tuned for updates!",
  },
  {
    question: "Can I request a custom feature?",
    answer: (
      <>
        Absolutely! If you need a feature tailored to your needs, you can submit
        a request through your{" "}
        <Link href={ROUTES.feedback} className="underline">
          Dashboard
        </Link>
        , and we’ll consider it for future updates.
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <Section className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-background -z-10" />

      <Container className="flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
              <Image
                src={`/qa.svg`}
                alt="Question Answer logo"
                width={60}
                height={60}
                className="relative"
              />
            </div>
            <h2 className="!m-0 !p-0 text-3xl md:text-4xl font-bold">{`FAQ's`}</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Everything you need to know about Reviews Plethora
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto w-full not-prose">
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4"
          >
            {faqs.map((faq, i) => {
              return (
                <AccordionItem
                  value={`item-${i + 1}`}
                  key={i}
                  className="border rounded-lg px-6 bg-card hover:bg-accent/5 transition-colors"
                >
                  <AccordionTrigger className="text-lg md:text-xl font-medium hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base md:text-lg text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </Container>
    </Section>
  );
}
