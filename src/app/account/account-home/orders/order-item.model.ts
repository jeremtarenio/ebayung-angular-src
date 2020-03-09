export class OrderItem {
  constructor(
    public productId: number,
    public productName: string,
    public price: number,
    public quantity: number
  ) {}
}
