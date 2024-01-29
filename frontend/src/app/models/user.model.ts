export interface User {
  id: number | undefined,
  name: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string | undefined,
  paymentCard: string,
  enabled: boolean,
  createdAt: string | undefined,
  updatedAt: string | undefined,
}
