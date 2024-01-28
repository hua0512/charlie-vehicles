import {VehiclePlugtype} from "./vehicle-plugtype.model";
import {ChargerpointPower} from "./chargerpoint-power.model";
import {ChargerpointStatus} from "./chargerpoint-status.model";

export interface ChargerPoint {
  id: number | undefined,
  address: string,
  latitude: number,
  longitude: number,
  plugType: VehiclePlugtype,
  power: ChargerpointPower,
  status: ChargerpointStatus
}
