import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { FAQItem } from "@/data/knowledge-base/faqs";

export function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  return (
    <Accordion className="mx-auto max-w-3xl">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id}>
          <AccordionTrigger className="text-base">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
