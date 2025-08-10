import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError, shareReplay } from "rxjs/operators";
import { Studio } from "../models/studio.model";

@Injectable({ providedIn: "root" })
export class StudioService {
  private readonly STUDIOS_URL = "assets/data/studio-mock-api.json";
  private studios$: Observable<Studio[]>;

  constructor(private http: HttpClient) {
    this.studios$ = this.http.get<{ Studios: Studio[] }>(this.STUDIOS_URL).pipe(
      map((response) => response.Studios),
      shareReplay(1),
      catchError(() => of([]))
    );
  }

  getStudios(): Observable<Studio[]> {
    return this.studios$;
  }

  getStudioById(id: number): Observable<Studio | undefined> {
    return this.studios$.pipe(
      map((studios) => studios.find((s) => s.Id === id))
    );
  }
}
