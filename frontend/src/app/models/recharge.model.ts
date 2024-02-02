export interface Recharge {
  id: number | undefined,
  userId: number,
  vehicleId: number | string,
  chargerpointId: number | string,
  price: number,
  kw: number,
  status: RechargeStatus,
  payment: RechargePayment,
  dateStart: string | undefined
  dateEnd: string | undefined,
}


export enum RechargeStatus {
  NOT_STARTED = "NotStarted",
  CHARGING = "Charging",
  COMPLETED = "Completed",
}

export enum RechargePayment {
  NOT_PROCESSED = "NotProcessed",
  CANCELLED = "Cancelled",
  PENDING = "Pending",
  COMPLETED = "Completed",
}
