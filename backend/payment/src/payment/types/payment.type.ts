export interface IPaymentProcessEvent {
  orderId: string;
  success: boolean;
  paymentId: string;
}
