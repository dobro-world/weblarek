import { IProduct } from "../../types";

export class Catalog {
    productsOnScreen: IProduct[] = [];
    selectedProduct: IProduct | null = null;

  getProducts(): IProduct[] {
    return this.productsOnScreen;
  }

  setProducts(products: IProduct[]): void {
    this.productsOnScreen = [...products];
  }

  getProductById(id: string): IProduct | undefined {
    return this.productsOnScreen.find(product => product.id === id);
  }

  setProductDetailed(product: IProduct): void {
    this.selectedProduct = { ...product };
  }

  getProductDetailed(): IProduct | null {
    return this.selectedProduct ? { ...this.selectedProduct } : null;
  }
}

