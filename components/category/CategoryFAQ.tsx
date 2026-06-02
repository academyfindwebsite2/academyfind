import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  categoryName: string;
}

export default function CategoryFAQ({
  categoryName,
}: Props) {
  const faqs = [
    {
      question: `Which city is best for ${categoryName}?`,
      answer:
        "Popular cities include Kota, Delhi, Hyderabad and Jaipur.",
    },
    {
      question: "How do I compare institutes?",
      answer:
        "Compare reviews, courses, facilities and location before making a decision.",
    },
  ];
  return (
    <section className="py-16 border-t">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
            >
              <AccordionTrigger>
                {faq.question}
              </AccordionTrigger>

              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}