import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-rating",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="rating">
      <mat-icon
        *ngFor="let star of [1, 2, 3, 4, 5]"
        [style.color]="star <= rating ? 'gold' : 'lightgray'"
      >
        {{ star <= rating ? "star" : "star_border" }}
      </mat-icon>
      <span>({{ rating | number: "1.1-1" }})</span>
    </div>
  `,
  styles: [
    `
      .rating {
        display: flex;
        align-items: center;
        gap: 2px;
      }
      mat-icon {
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    `,
  ],
})
export class RatingComponent {
  @Input() rating: number = 0;
}
