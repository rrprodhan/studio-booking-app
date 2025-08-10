import { Pipe, PipeTransform } from "@angular/core";
import { format, parse } from "date-fns";

@Pipe({
  name: "timeFormat",
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return "";

    const parsedDate = parse(value, "HH:mm", new Date());

    return format(parsedDate, "hh:mm a");
  }
}
