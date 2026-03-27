import { IApi, IProduct, IOrder, IOrderResult, IProductsResponse } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class AppApi {
  constructor(private baseApi: IApi) {}

  async getProductList(): Promise<IProduct[]> {
    const response = await this.baseApi.get<IProductsResponse>('/product/');

    return response.items.map((item) => ({
      ...item,
      image: `${CDN_URL}${item.image}`,
    }));
  }

  async postOrder(order: IOrder): Promise<IOrderResult> {
    const response = await this.baseApi.post<IOrderResult>('/order/', order);
    return response;
  }
}