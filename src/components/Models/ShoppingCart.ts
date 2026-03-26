import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ShoppingCart {
  private _shoppingCartProducts: IProduct[] = [];

  constructor(private events: IEvents) {}

  getProductsFromCart(): IProduct[] {
    return this._shoppingCartProducts.map(product => ({ ...product }));
  }

  addProductToCart(product: IProduct): void {
    this._shoppingCartProducts.push({ ...product });

    this.events.emit('basket:changed', this.getProductsFromCart());
  }

  removeProductFromCart(product: IProduct): void {
    this._shoppingCartProducts = this._shoppingCartProducts.filter(
      item => item.id !== product.id
    );

    this.events.emit('basket:changed', this.getProductsFromCart());
  }

  clearCart(): void {
    this._shoppingCartProducts = [];

    this.events.emit('basket:changed', this.getProductsFromCart());
  }

  getTotalPrice(): number {
    return this._shoppingCartProducts.reduce((total, product) => {
      return total + (product.price ?? 0);
    }, 0);
  }

  getProductCount(): number {
    return this._shoppingCartProducts.length;
  }

  hasCartItem(id: string): boolean {
    return this._shoppingCartProducts.some(product => product.id === id);
  }
}