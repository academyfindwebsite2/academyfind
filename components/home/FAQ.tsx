import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const faqs = [
  {
    question: "How does AcademyFind rank coaching institutes?",
    answer:
      "Institutes are ranked using ratings, reviews, popularity, and other quality signals.",
  },
  {
    question: "Can I compare two coaching institutes?",
    answer:
      "Yes. AcademyFind provides detailed comparison pages to compare fees, ratings, reviews, and more.",
  },
  {
    question: "Are institute reviews verified?",
    answer:
      "We continuously work to improve review quality and detect suspicious activity.",
  },
  {
    question: "How can I find coaching institutes in my city?",
    answer:
      "Search by exam category and city to discover relevant coaching institutes.",
  },
  {
    question: "Does AcademyFind cover online coaching platforms?",
    answer:
      "Yes. Online coaching providers are also listed and compared.",
  },
];

export function FAQSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <span className="text-sm font-medium text-amber-500">
            FAQ
          </span>

          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Everything you need to know about AcademyFind.
          </p>
        </div>

        {/* FAQ Card */}
        <div
          className="
            rounded-2xl
            border
            bg-background
            p-2
            shadow-sm
            sm:p-4
          "
        >
          <Accordion
            type="single"
            collapsible
            className="w-full"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b last:border-b-0"
              >
                <AccordionTrigger
                  className="
                    py-4
                    text-left
                    text-sm
                    font-medium
                    hover:no-underline
                    sm:py-5
                    sm:text-base
                  "
                >
                  {faq.question}
                </AccordionTrigger>

                <AccordionContent
                  className="
                    pb-4
                    text-sm
                    leading-6
                    text-muted-foreground
                    sm:text-base
                  "
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Still have questions?
            <Link href={'/contact'} className="ml-1 font-medium text-amber-500" prefetch={false}>
              Contact our team.
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}