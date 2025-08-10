import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Observable, map, catchError, of } from "rxjs";
import { RatingComponent } from "../../shared/components/rating.component";
import { Coordinates, Studio } from "../../core/models/studio.model";
import { StudioService } from "../../core/services/studio.service";
import { GeolocationService } from "../../core/services/geolocation.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BookingFormComponent } from "../booking-form/booking-form.component";
import { StudioFilterPipe } from "../../shared/pipes/studio-filter.pipe";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

@Component({
  selector: "app-studio-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    RatingComponent,
    MatTooltipModule,
    StudioFilterPipe,
  ],
  templateUrl: "./studio-list.component.html",
  styleUrls: ["./studio-list.component.scss"],
})
export class StudioListComponent implements OnInit {
  studios$: Observable<Studio[]>;
  searchTerm: string = "";
  isLoading = false;
  locationError: string | null = null;
  gridCols = 3;
  rowHeight = "1:1.5";

  constructor(
    private studioService: StudioService,
    private geolocationService: GeolocationService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) {
    this.studios$ = this.studioService.getStudios();
  }

  ngOnInit(): void {
    this.setupResponsiveGrid();
  }

  openBookingDialog(studio: Studio): void {
    this.dialog.open(BookingFormComponent, {
      width: "600px",
      data: { studio },
    });
  }

  searchByRadius(radiusKm: number): void {
    this.isLoading = true;
    this.locationError = null;

    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.studios$ = this.studioService.getStudios().pipe(
          map((studios) =>
            studios.filter((studio) => {
              const studioCoords = studio.Location.Coordinates;
              return (
                this.calculateDistance(userCoords, studioCoords) <= radiusKm
              );
            })
          ),
          catchError(() => of([]))
        );
        this.isLoading = false;
      },
      error: (err) => {
        this.locationError =
          "Could not get location. Please enable location services.";
        this.isLoading = false;
      },
    });
  }

  private calculateDistance(
    coord1: { lat: number; lng: number },
    coord2: Coordinates
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(coord2.Latitude - coord1.lat);
    const dLon = this.deg2rad(coord2.Longitude - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coord1.lat)) *
        Math.cos(this.deg2rad(coord2.Latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getUniqueAreas(studios: Studio[]): string[] {
    return [...new Set(studios.map((s) => s.Location.Area))];
  }

  private setupResponsiveGrid(): void {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.gridCols = 1;
          this.rowHeight = "1:1.4"; // Taller aspect ratio for mobile
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.gridCols = 2;
          this.rowHeight = "1:1.5";
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.gridCols = 3;
          this.rowHeight = "1:1.5";
        } else if (
          result.breakpoints[Breakpoints.Large] ||
          result.breakpoints[Breakpoints.XLarge]
        ) {
          this.gridCols = 4;
          this.rowHeight = "1:1.6";
        } else {
          this.gridCols = 3;
          this.rowHeight = "1:1.5";
        }
      });
  }
}
