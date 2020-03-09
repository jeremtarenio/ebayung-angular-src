import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject } from "rxjs";
import { Order } from "./order.model";

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  orders: Order[] = [];
  ordersFetched = new Subject<Order[]>();

  constructor(private httpClient: HttpClient) {}

  fetchOrders(userId: number) {
    return this.httpClient.get<{ success: number; orders: Order[] }>(environment.apiUrl + "/api/orders/" + userId);
  }

  getOrders() {
    return this.orders;
  }
}
