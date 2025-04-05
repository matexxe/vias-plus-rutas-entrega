 export interface Stop {
  id: string;
  address: string;
  city: string;
  type:
    | "store"
    | "restaurant"
    | "pharmacy"
    | "supermarket"
    | "cafe";
  time: string;
  coordinates: [number, number];
}

export interface RouteDetails {
  totalDistance: number;
  totalTime: number;
  stops: number;
  isCalculating: boolean;
  error?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}
