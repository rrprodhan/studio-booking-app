export interface Coordinates {
  Latitude: number;
  Longitude: number;
}

export interface Location {
  City: string;
  Area: string;
  Address: string;
  Coordinates: Coordinates;
}

export interface Availability {
  Open: string;
  Close: string;
}

export interface Studio {
  Id: number;
  Name: string;
  Type: string;
  Location: Location;
  Amenities: string[];
  PricePerHour: number;
  Currency: string;
  Availability: Availability;
  Rating: number;
  Images: string[];
}
