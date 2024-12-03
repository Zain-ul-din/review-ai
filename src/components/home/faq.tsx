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
    <Section>
      <Container className="flex flex-col gap-6">
        <div className="flex justify-center items-center gap-4">
          <Image
            src={`/qa.svg`}
            alt="Question Answer logo"
            width={60}
            height={60}
          />
          <h2 className="!m-0 !p-0">{`FAQ's`}</h2>
        </div>

        <div className="max-w-[650px] mx-auto w-full not-prose">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => {
              return (
                <AccordionItem value={`item-${i + 1}`} key={i}>
                  <AccordionTrigger className="text-xl">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-lg">
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
