import { Pipe, PipeTransform } from "@angular/core";
import { Studio } from "../../core/models/studio.model";

@Pipe({
  name: "studioFilter",
  standalone: true,
})
export class StudioFilterPipe implements PipeTransform {
  transform(studios: Studio[], searchTerm: string): Studio[] {
    if (!searchTerm) return studios;

    return studios.filter(
      (studio) =>
        studio.Location.Area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studio.Location.City.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
