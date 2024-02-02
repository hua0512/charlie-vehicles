export interface Vehicle {
  id: number | undefined,
  carRegistration: string,
  userId: number,
  brand: string,
  model: string,
  capacity: number,
  plugType: VehiclePlugtype,
}

export enum VehiclePlugtype {
  Schuko = 'Schuko', CSS = 'CSS', Mennekes = 'Mennekes', CHAdeMO = 'CHAdeMO'
}
