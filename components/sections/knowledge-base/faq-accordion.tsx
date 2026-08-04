import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { FAQ } from "@/lib/db/schema";

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  return (
    <Accordion className="mx-auto max-w-3xl">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={String(faq.id)}>
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
