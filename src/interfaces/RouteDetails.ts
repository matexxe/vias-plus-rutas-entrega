export interface RouteDetails {
  totalDistance: number;
  totalTime: number;
  stops: number;
  isCalculating: boolean;
  error?: string;
  instructions?: string[];
}
