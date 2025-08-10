import { Studio } from "./studio.model";

export interface Booking {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  userName: string;
  userEmail: string;
  studio: Studio;
}
