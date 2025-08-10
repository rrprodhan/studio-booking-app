import { Pipe, PipeTransform } from "@angular/core";
import { format } from "date-fns";

@Pipe({
  name: "customDate",
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return "";

    const date = new Date(value);
    return format(date, "do MMMM, yyyy");
  }
}
