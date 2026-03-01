import { IApi, IProduct, IOrder, IOrderResult, IProductsResponse } from '../../types';

export class AppApi {
  constructor(private baseApi: IApi) {}

  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this.baseApi.get<IProductsResponse>('/product/');
      return response.items;
    } catch (error) {
      console.error('Ошибка при получении товаров:', error);
      throw error;
    }
  }

  async postOrder(order: IOrder): Promise<IOrderResult> {
    try {
      const response = await this.baseApi.post<IOrderResult>('/order/', order);
      return response;
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      throw error;
    }
  }
}