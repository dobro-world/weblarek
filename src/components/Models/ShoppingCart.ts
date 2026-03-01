import { IProduct } from "../../types";

export class ShoppingCart {
  private _shoppingCartProducts: IProduct[] = [];

  getProductsFromCart(): IProduct[] {
    return this._shoppingCartProducts.map(product => ({ ...product }));
  }

  addProductToCart(product: IProduct): void {
    this._shoppingCartProducts.push({ ...product });
  }

  removeProductFromCart(product: IProduct): void {
    this._shoppingCartProducts = this._shoppingCartProducts.filter(
      item => item.id !== product.id
    );
  }

  clearCart(): void {
    this._shoppingCartProducts = [];
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