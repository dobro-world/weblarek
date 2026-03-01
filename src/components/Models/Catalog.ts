import { IProduct } from "../../types";

export class Catalog {
  private _productsOnScreen: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  getProducts(): IProduct[] {
    return this._productsOnScreen;
  }

  setProducts(products: IProduct[]): void {
    this._productsOnScreen = [...products];
  }

  getProductById(id: string): IProduct | undefined {
    return this._productsOnScreen.find(product => product.id === id);
  }

  setProductDetailed(product: IProduct): void {
    this._selectedProduct = { ...product };
  }

  getProductDetailed(): IProduct | null {
    return this._selectedProduct ? { ...this._selectedProduct } : null;
  }
}

