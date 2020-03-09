import { OrderItem } from './order-item.model';

export class Order {
  constructor(
    public orderId: number,
    public firstName: string,
    public lastName: string,
    public shippingAddress: string,
    public contactNumber: string,
    public email: string,
    public date: string,
    public userId: number,
    public status: string,
    public orderItems: OrderItem[]
  ) {}
}
