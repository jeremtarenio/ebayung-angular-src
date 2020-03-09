import { Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { AuthService } from '../../auth.service';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = null;
  loading = true;

  constructor(private ordersService: OrdersService, private authService: AuthService) { }

  ngOnInit() {
    this.ordersService.fetchOrders(this.authService.getUserId()).subscribe(res => {
      this.loading = false;
      this.orders = res.orders;
    });
  }

  computeTotal(orderItems: OrderItem[]) {
    let total = 0;

    orderItems.forEach(obj => {
      total += obj.price * obj.quantity;
    });

    return Math.round(((total) + Number.EPSILON) * 100) / 100;
  }



}
