import './scss/styles.scss';
import { EventEmitter, IEvents } from './components/base/Events';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { AppApi } from './components/Models/AppApi';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Catalog } from './components/Models/Catalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';

import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';
import { Basket } from './components/View/Basket';

import { ContactsForm } from './components/View/ContactsForm';
import { OrderForm } from './components/View/OrderForm';
import { OrderSuccess } from './components/View/OrderSuccess';

import { IOrder, TPayment } from './types/index';

document.addEventListener('DOMContentLoaded', () => {
  const events: IEvents = new EventEmitter();
  const api = new AppApi(new Api(API_URL));

  const catalog = new Catalog(events);
  const cart = new ShoppingCart(events);
  const buyer = new Buyer(events);

  // Получаем корневые элементы
  const headerEl = ensureElement<HTMLElement>('.header', document.body);
  const galleryEl = ensureElement<HTMLElement>('.gallery', document.body);
  const modalEl = ensureElement<HTMLElement>('.modal', document.body);

  // Создаем статичные компоненты
  const header = new Header(events, headerEl);
  const gallery = new Gallery(galleryEl);
  const modal = new Modal(events, modalEl);

  // Получаем темплейты
  const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog', document.body);
  const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview', document.body);
  const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket', document.body);
  const basketTemplate = ensureElement<HTMLTemplateElement>('#basket', document.body);
  const orderTemplate = ensureElement<HTMLTemplateElement>('#order', document.body);
  const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts', document.body);
  const successTemplate = ensureElement<HTMLTemplateElement>('#success', document.body);

  // Компоненты, которые создаются один раз
  let basketView: Basket | null = null;
  let orderForm: OrderForm | null = null;
  let contactsForm: ContactsForm | null = null;
  let successView: OrderSuccess | null = null;

  // Изменение каталога
  events.on('catalog:changed', () => {
    const products = catalog.getProducts();
    const cards = products.map(product => {
      const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
      const card = new CatalogCard(cardElement, events);
      
      card.id = product.id;
      card.title = product.title;
      card.price = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
      card.image = product.image;
      card.category = product.category;
      
      return card.render();
    });
    
    gallery.catalog = cards;
  });

  // Выбор карточки для просмотра
  events.on('card:selected', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
      catalog.setProductDetailed(product);
    }
  });

  // Изменение выбранного товара
  events.on('catalog:selected', () => {
    const product = catalog.getProductDetailed();
    if (!product) return;

    const cardElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
    const previewCard = new PreviewCard(cardElement, events);
    
    const isInCart = cart.hasCartItem(product.id);
    const hasPrice = product.price !== null && product.price > 0;
    
    previewCard.id = product.id;
    previewCard.title = product.title;
    previewCard.price = hasPrice ? `${product.price} синапсов` : 'Бесценно';
    previewCard.image = product.image;
    previewCard.category = product.category;
    previewCard.text = product.description;

    if (!hasPrice) {
      previewCard.buttonText = 'Недоступно';
      previewCard.buttonDisabled = true;
    } else {
      previewCard.buttonText = isInCart ? 'Удалить из корзины' : 'В корзину';
      previewCard.buttonDisabled = false;
    }

    modal.content = previewCard.render();
    modal.open();
});

  // Нажатие кнопки в превью
  events.on('preview:button-clicked', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (!product) return;

    if (cart.hasCartItem(product.id)) {
      cart.removeProductFromCart(product);
    } else {
      cart.addProductToCart(product);
    }
    modal.close();
});

  // Изменение корзины
  events.on('basket:changed', () => {
    header.counter = cart.getProductCount();
    if (basketView) {
      events.emit('basket:open');
    }
  });

  // Открытие корзины
  events.on('basket:open', () => {
    if (!basketView) {
      const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
      basketView = new Basket(events, basketElement);
    }
    
    const items = cart.getProductsFromCart();
    const cards = items.map((item, index) => {
      const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
      const card = new BasketCard(cardElement, events);
      
      card.id = item.id;
      card.title = item.title;
      card.price = `${item.price} синапсов`;
      card.index = index + 1;
      
      return card.render();
    });
    
    basketView.listItems = cards;
    basketView.totalPrice = cart.getTotalPrice();
    basketView.buttonDisabled = items.length === 0;
    
    modal.content = basketView.render();
    modal.open();
  });

  // Удаление товара из корзины
  events.on('basket:delete-item', (data: { id: string }) => {
    const product = catalog.getProductById(data.id);
    if (product) {
      cart.removeProductFromCart(product);
    }
  });

  // Начало оформления заказа
  events.on('order:start', () => {
    if (!orderForm) {
      const orderElement = cloneTemplate<HTMLElement>(orderTemplate);
      orderForm = new OrderForm(events, orderElement);
    }
    
    const buyerData = buyer.getBuyerData();
    const validation = buyer.validateOrderStep();
    const isValid = Object.keys(validation.errors).length === 0;
    
    orderForm.address = buyerData.address;
    orderForm.payment = buyerData.payment;
    orderForm.valid = isValid;
    orderForm.errorText = validation.errors.address || validation.errors.payment || '';
    
    modal.content = orderForm.render();
    modal.open();
  });

  // Изменение адреса
  events.on('order:address:changed', (data: { value: string }) => {
    buyer.setBuyerData({ address: data.value });
  });

  // Изменение способа оплаты
  events.on('order:payment:changed', (data: { value: TPayment }) => {
    buyer.setBuyerData({ payment: data.value });
  });

  // Изменение данных покупателя
  events.on('buyer:changed', () => {
  const buyerData = buyer.getBuyerData();

  // Адрес + оплата
  if (orderForm) {
    const validation = buyer.validateOrderStep();
    const isValid = Object.keys(validation.errors).length === 0;

    orderForm.address = buyerData.address;
    orderForm.payment = buyerData.payment;
    orderForm.valid = isValid;
    orderForm.errorText =
      validation.errors.address ||
      validation.errors.payment ||
      '';
    orderForm.render();
  }

  // Емейл + номер телефона
  if (contactsForm) {
    const validation = buyer.validateContactsStep();
    const isValid = Object.keys(validation.errors).length === 0;

    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    contactsForm.valid = isValid;
    contactsForm.errorText =
      validation.errors.email ||
      validation.errors.phone ||
      '';
  }
});

  // Переход ко второй форме
  events.on('order:next', () => {
    const validation = buyer.validateOrderStep();

    if (Object.keys(validation.errors).length > 0) return;

    if (!contactsForm) {
      const contactsElement = cloneTemplate<HTMLElement>(contactsTemplate);
      contactsForm = new ContactsForm(events, contactsElement);
    }

    const buyerData = buyer.getBuyerData();

    const contactsValidation = buyer.validateContactsStep();

    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    contactsForm.valid = Object.keys(contactsValidation.errors).length === 0;
    contactsForm.errorText =
      contactsValidation.errors.email ||
      contactsValidation.errors.phone ||
      '';

    modal.content = contactsForm.render();
});

  // Изменение емейла
  events.on('contacts:email:changed', (data: { value: string }) => {
    buyer.setBuyerData({ email: data.value });
  });

  // Изменение номера телефона
  events.on('contacts:phone:changed', (data: { value: string }) => {
    buyer.setBuyerData({ phone: data.value });
  });

  // Отправка формы
  events.on('form:submit', async () => {
    const validation = buyer.validateContactsStep();
    if (Object.keys(validation.errors).length > 0) return;

    const buyerData = buyer.getBuyerData();
    const orderItems = cart.getProductsFromCart().map(item => item.id);
    const totalPrice = cart.getTotalPrice();

    const orderData: IOrder = {
      payment: buyerData.payment,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address,
      items: orderItems,
      total: totalPrice
    };

    try {
      const result = await api.postOrder(orderData);

      cart.clearCart();
      buyer.clearBuyerData();

      if (orderForm) {
        orderForm.clear();
      }

      if (contactsForm) {
        contactsForm.clear();
      }

      if (!successView) {
        const successElement = cloneTemplate<HTMLElement>(successTemplate);
        successView = new OrderSuccess(events, successElement);
      }

      successView.total = result.total;
      modal.content = successView.render();
      modal.open();

    } catch {}
  });

  // Закрытие модального окна
  events.on('modal:closed', () => {
    modal.close();
  });

  // Инициализация
  async function init() {
    try {
      const products = await api.getProductList();
      catalog.setProducts(products);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }

  init();
});