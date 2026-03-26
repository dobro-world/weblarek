import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  private _productsOnScreen: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  constructor(private events: IEvents) {}

  getProducts(): IProduct[] {
    return this._productsOnScreen;
  }

  setProducts(products: IProduct[]): void {
    this._productsOnScreen = [...products];

    this.events.emit('catalog:changed', this.getProducts());
  }

  getProductById(id: string): IProduct | undefined {
    return this._productsOnScreen.find(product => product.id === id);
  }

  setProductDetailed(product: IProduct): void {
    this._selectedProduct = { ...product };

    this.events.emit('catalog:selected', this._selectedProduct);
  }

  getProductDetailed(): IProduct | null {
    return this._selectedProduct ? { ...this._selectedProduct } : null;
  }
}

