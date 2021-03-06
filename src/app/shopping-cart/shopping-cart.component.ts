import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../models/cart.model';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/order.service';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  productsInCart: Cart[] = [];
  totalPrice: number = 0.00;

  constructor(private cart: ShoppingCartService,
              private orderService: OrderService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.productsInCart = this.cart.getItemsInCart();
    this.totalPrice = this.calculateTotalPrice(this.productsInCart);
    this.cart.cartChanged.subscribe((cart: Cart[]) => {
      this.productsInCart = cart;
      this.totalPrice = this.calculateTotalPrice(cart);
    });
  }

  removeFromCart(item: Cart): void {
    this.cart.removeFromCart(item);
  }

  setQuantityCart(item: Cart): void {
    this.cart.setQuantityCart(item.product, item.amount);
  }

  clearCart(): void {
    this.cart.clearCart();
  }

  createOrder(): void {
    if (this.authService.getIsAuth()) {
      this.orderService.createOrder(this.productsInCart).subscribe((response: any) => {
        this.cart.clearCartWithoutAlert();
        this.router.navigateByUrl('/account/orders/' + response._id);
      });
    } else {
      this.router.navigateByUrl('/account/login');
    }
  }

  private calculateTotalPrice(cart: Cart[]): number {
    let totalPrice: number = 0;
    cart.forEach(item => {
      totalPrice += item.product.getPrice() * item.amount;
    });

    return totalPrice;
  }
}
