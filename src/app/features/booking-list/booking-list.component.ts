import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { BookingService } from "../../core/services/booking.service";
import { CustomDatePipe } from "../../shared/pipes/pretty-date.pipe";
import { TimeFormatPipe } from "../../shared/pipes/time-format.pipe";

@Component({
  selector: "app-booking-list",
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterModule,
    MatCardModule,
    MatSnackBarModule,
    CustomDatePipe,
    TimeFormatPipe,
  ],
  templateUrl: "./booking-list.component.html",
  styleUrls: ["./booking-list.component.scss"],
})
export class BookingListComponent {
  bookings$ = this.bookingService.bookings$;

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  cancelBooking(id: string): void {
    this.bookingService.deleteBooking(id);
    this.snackBar.open("Booking cancelled", "Dismiss", {
      duration: 3000,
      panelClass: "success-snackbar",
    });
  }

  formatDate(date: string | Date): Date {
    return typeof date === "string" ? new Date(date) : date;
  }
}
