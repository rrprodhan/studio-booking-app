import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Booking } from "../models/booking.model";

@Injectable({ providedIn: "root" })
export class BookingService {
  private readonly STORAGE_KEY = "studio_bookings";
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const bookings = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    this.bookingsSubject.next(bookings);
  }

  get bookings$(): Observable<Booking[]> {
    return this.bookingsSubject.asObservable();
  }

  addBooking(booking: Omit<Booking, "id">): void {
    const newBooking: Booking = { ...booking, id: crypto.randomUUID() };
    const updatedBookings = [...this.bookingsSubject.value, newBooking];
    this.updateBookings(updatedBookings);
  }

  deleteBooking(id: string): void {
    const updatedBookings = this.bookingsSubject.value.filter(
      (b) => b.id !== id
    );
    this.updateBookings(updatedBookings);
  }

  private updateBookings(bookings: Booking[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookings));
    this.bookingsSubject.next(bookings);
  }
}
