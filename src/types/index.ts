import { categoryMap } from '../utils/constants';

type Category = keyof typeof categoryMap;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | '';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: Category;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IValidationResult {
  errors: Partial<Record<keyof IBuyer, string>>;
}

export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

export interface IOrder extends IBuyer {
   items: string[];
   total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IOrderPaymentEvent {
  value: TPayment;
}

export interface IOrderChangeEvent {
  field?: string;
  value: string;
}

export interface IFormChangeData {
  field: keyof IBuyer;
  value: string;
}