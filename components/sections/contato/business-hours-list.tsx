import { Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function BusinessHoursList() {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Clock className="size-4 text-primary" />
        <h3 className="font-heading text-base font-medium">Horário de atendimento</h3>
      </div>
      <ul className="mt-4 space-y-2">
        {siteConfig.contact.businessHours.map((item) => (
          <li
            key={item.day}
            className="flex items-center justify-between text-sm text-muted-foreground"
          >
            <span>{item.day}</span>
            <span className="font-medium text-foreground">{item.hours}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
