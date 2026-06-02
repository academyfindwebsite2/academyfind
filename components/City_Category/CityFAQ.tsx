import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CityFAQ({
  categoryName,
  cityName,
}: {
  categoryName: string;
  cityName: string;
}) {
  const faqs = [
    {
      question: `Which is the best ${categoryName} in ${cityName}?`,
      answer:
        "The best institute depends on your budget, faculty preferences, batch size, results, and learning style. Compare ratings, reviews, and course offerings before deciding.",
    },
    {
      question: `How much does ${categoryName} cost in ${cityName}?`,
      answer:
        "Fees vary depending on the institute, course duration, and facilities. Compare multiple institutes to find the best value for your budget.",
    },
    {
      question: `How can I compare institutes in ${cityName}?`,
      answer:
        "AcademyFind lets you compare ratings, reviews, courses, facilities, and locations to help you make an informed decision.",
    },
    {
      question: `Are online and offline courses available?`,
      answer:
        "Many institutes now offer both online and offline learning options. Check the institute profile for detailed course information.",
    },
  ];

  return (
    <section className="mt-20">
      <div className="mb-8">
        <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-700">
          Frequently Asked Questions
        </span>

        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
          Everything You Need to Know
        </h2>

        <p className="mt-3 max-w-2xl text-slate-600">
          Find answers to the most common questions about
          {` ${categoryName} `}
          institutes in {cityName}.
        </p>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-white p-2 shadow-sm">
        <Accordion
          type="single"
          collapsible
          className="w-full"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-amber-100 px-4"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>

              <AccordionContent className="text-slate-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}