import {VehiclePlugtype} from "./vehicle.model";

export interface ChargerPoint {
  id: number | undefined,
  address: string,
  latitude: number,
  longitude: number,
  plugType: VehiclePlugtype,
  power: ChargerpointPower,
  status: ChargerpointStatus
}

export enum ChargerpointPower {
  LENTA = 'LENTA', MEDIA = 'MEDIA', RAPIDA = 'RAPIDA', ULTRA_RAPIDA = 'ULTRA_RAPIDA'
}

export enum ChargerpointStatus{
  MANTENIMIENTO = "MANTENIMIENTO", DISPONIBLE = "DISPONIBLE", EN_SERVICIO = "EN_SERVICIO"
}
