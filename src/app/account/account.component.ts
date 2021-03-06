import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Order } from '../models/order.model';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  orderSubscription: Subscription;
  meSubscription: Subscription;
  accountInfoForm: FormGroup;
  orders: Order[];
  isAdmin: boolean;
  adminOrders: Order[];

  constructor(private orderService: OrderService,
              private authService: AuthService) { }


  ngOnInit(): void {
    this.authService.getAdminStatusListener().subscribe(res => {
      this.isAdmin = res;
      if (res) {
        this.orderSubscription = this.orderService.getOrders().subscribe(orders => {
          this.adminOrders = orders;
        });
      }
    });

    if (this.authService.getIsAdmin()) {
      this.isAdmin = true;
      this.orderSubscription = this.orderService.getOrders().subscribe(orders => {
        this.adminOrders = orders;
      });
    }

    this.authService.me().subscribe(response => {
      this.accountInfoForm = new FormGroup({
        firstName: new FormControl(response.user.firstName, Validators.required),
        lastName: new FormControl(response.user.lastName, Validators.required),
        email: new FormControl(response.user.email),
        phoneNumber: new FormControl(response.user.phoneNumber),
        country: new FormControl(response.user.country),
        city: new FormControl(response.user.city),
        street: new FormControl(response.user.street),
        streetNumber: new FormControl(response.user.streetNumber),
        postalCode: new FormControl(response.user.postalCode)
      });
      this.orders = response.orders;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
