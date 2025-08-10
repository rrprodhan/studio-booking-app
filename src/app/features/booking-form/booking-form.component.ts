import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { addMinutes, format, parseISO } from "date-fns";
import { Studio } from "../../core/models/studio.model";
import { BookingService } from "../../core/services/booking.service";
import { MatIconModule } from "@angular/material/icon";
import { Booking } from "../../core/models/booking.model";

@Component({
  selector: "app-booking-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: "./booking-form.component.html",
  styleUrls: ["./booking-form.component.scss"],
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  timeSlots: string[] = [];
  errorMessage: string | null = null;
  minDate: Date;

  constructor(
    public dialogRef: MatDialogRef<BookingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studio: Studio },
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    this.minDate = new Date();
    this.bookingForm = this.fb.group({
      date: [null, Validators.required],
      timeSlot: ["", Validators.required],
      userName: ["", [Validators.required, Validators.minLength(3)]],
      userEmail: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.bookingForm.get("date")?.valueChanges.subscribe((date) => {
      if (date) {
        this.generateTimeSlots(date);
        this.bookingForm.get("timeSlot")?.reset();
      }
    });
  }

  private generateTimeSlots(selectedDate: Date): void {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const nowHours = today.getHours();
    const nowMinutes = today.getMinutes();

    const openHour = parseInt(
      this.data.studio.Availability.Open.split(":")[0],
      10
    );
    const closeHour = parseInt(
      this.data.studio.Availability.Close.split(":")[0],
      10
    );

    this.timeSlots = [];

    for (let hour = openHour; hour < closeHour; hour++) {
      // Skip past time slots for today
      if (isToday && hour < nowHours) continue;
      if (isToday && hour === nowHours && nowMinutes > 0) continue;

      this.timeSlots.push(`${hour}:00 - ${hour + 1}:00`);
    }
  }

  submitBooking(): void {
    if (this.bookingForm.invalid) return;

    const formValue = this.bookingForm.value;
    const bookingData: Omit<Booking, "id"> = {
      date: formValue.date,
      startTime: formValue.timeSlot.split(" - ")[0],
      endTime: formValue.timeSlot.split(" - ")[1],
      userName: formValue.userName,
      userEmail: formValue.userEmail,
      studio: this.data.studio,
    };

    this.bookingService.addBooking(bookingData);
    this.dialogRef.close(true);
  }
}
