import {VehiclePlugtype} from "./vehicle-plugtype.model";

export interface Vehicle {
  id: number | undefined,
  carRegistration: string,
  userId: number,
  brand: string,
  model: string,
  capacity: number,
  plugType: VehiclePlugtype,
}
