export interface Stop {
  id: string;
  address: string;
  city: string;
  type: "store" | "restaurant" | "pharmacy" | "supermarket";
  time: string;
  coordinates: [number, number];

}
