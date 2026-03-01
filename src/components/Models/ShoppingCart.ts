import { IProduct } from "../../types";

export class ShoppingCart {
    shoppingCartProducts: IProduct[] = [];

  getProductsFromCart(): IProduct[] {
    return this.shoppingCartProducts.map(product => ({ ...product }));
  }

  addProductToCart(product: IProduct): void {
    this.shoppingCartProducts.push({ ...product });
  }

  removeProductFromCart(product: IProduct): void {
    this.shoppingCartProducts = this.shoppingCartProducts.filter(
      item => item.id !== product.id
    );
  }

  clearCart(): void {
    this.shoppingCartProducts = [];
  }

  getTotalPrice(): number {
    return this.shoppingCartProducts.reduce((total, product) => {
      return total + (product.price ?? 0);
    }, 0);
  }

  getProductCount(): number {
    return this.shoppingCartProducts.length;
  }

  hasCartItem(id: string): boolean {
    return this.shoppingCartProducts.some(product => product.id === id);
  }
}