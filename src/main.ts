// main.ts
import './scss/styles.scss';
import { EventEmitter, IEvents } from './components/base/Events';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { AppApi } from './components/Models/AppApi';

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

import { 
  IProduct, 
  IOrderPaymentEvent, 
  IFormChangeData,
  IOrder,
  TPayment
} from './types/index';

document.addEventListener('DOMContentLoaded', () => {
  const events: IEvents = new EventEmitter();
  const api = new AppApi(new Api(API_URL));

  const catalog = new Catalog(events);
  const cart = new ShoppingCart(events);
  const buyer = new Buyer(events);

  const headerEl = document.querySelector('.header');
  const galleryEl = document.querySelector('.gallery');
  const modalEl = document.querySelector('.modal');

  if (!headerEl || !galleryEl || !modalEl) {
    throw new Error('Some main DOM elements are missing');
  }

  const header = new Header(events, headerEl as HTMLElement);
  const gallery = new Gallery(galleryEl as HTMLElement);
  const modal = new Modal(events, modalEl as HTMLElement);

  const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
  const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
  const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
  const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
  const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
  const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
  const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

  if (!cardCatalogTemplate || !cardPreviewTemplate || !cardBasketTemplate || 
      !basketTemplate || !orderTemplate || !contactsTemplate || !successTemplate) {
    throw new Error('Some templates are missing');
  }

  let currentPreviewCard: PreviewCard | null = null;
  let currentPreviewProductId: string | null = null;

  let isBasketOpen = false;

  function renderBasket() {
    const items = cart.getProductsFromCart();
    header.counter = items.length;

    const cards = items.map((item, index) => {
      const node = cardBasketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const card = new BasketCard(events, node);

      card.product = item;
      card.title = item.title;
      card.price = `${item.price} синапсов`;
      card.index = index + 1;

      return card.render();
    });

    const basketNode = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const basketView = new Basket(events, basketNode);

    basketView.listItems = cards;
    basketView.totalPrice = cart.getTotalPrice();
    
    return basketView.render();
  }

  events.on('catalog:changed', () => {
    const products = catalog.getProducts();
    const cards = products.map(product => {
      const node = cardCatalogTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const card = new CatalogCard(events, node);

      card.title = product.title;
      card.price = `${product.price} синапсов`;
      card.image = product.image;
      card.category = product.category;

      node.addEventListener('click', () => {
        events.emit('card:select', product);
      });

      return card.render();
    });

    gallery.catalog = cards;
  });

  events.on('card:select', (product: IProduct) => {
    catalog.setProductDetailed(product);
  });

  events.on('catalog:selected', (product: IProduct) => {
    currentPreviewProductId = product.id;
    
    const node = cardPreviewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const card = new PreviewCard(events, node);

    card.title = product.title;
    card.price = product.price !== null ? `${product.price} синапсов` : '0 синапсов';
    card.image = product.image;
    card.category = product.category;
    card.text = product.description;
    
    const isInCart = cart.hasCartItem(product.id);
    card.isInCart = isInCart;

    currentPreviewCard = card;

    modal.content = card.render();
    modal.open();
    isBasketOpen = false;
  });

  events.on('card:add', () => {
    const product = catalog.getProductDetailed();
    if (product && product.price !== null && product.price > 0) {
      cart.addProductToCart(product);
    }
  });

  events.on('card:delete', (product: IProduct) => {
    cart.removeProductFromCart(product);
  });

  events.on('card:delete-from-preview', () => {
    const product = catalog.getProductDetailed();
    if (product) {
      cart.removeProductFromCart(product);
    }
  });

  events.on('basket:changed', () => {
    const items = cart.getProductsFromCart();

    header.counter = items.length;

    if (currentPreviewCard && currentPreviewProductId && modal.isOpen && !isBasketOpen) {
      const isInCart = cart.hasCartItem(currentPreviewProductId);
      currentPreviewCard.updateButtonState(isInCart);
    }

    if (isBasketOpen && modal.isOpen) {
      const updatedBasket = renderBasket();
      modal.content = updatedBasket;
    }
  });

  events.on('basket:open', () => {
    isBasketOpen = true;
    const basketContent = renderBasket();
    modal.content = basketContent;
    modal.open();
  });

  events.on('order:start', () => {
    if (cart.getProductCount() === 0) {
      return;
    }
    
    const node = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const orderForm = new OrderForm(events, node);
    
    const buyerData = buyer.getBuyerData();
    if (buyerData.address) {
      orderForm.address = buyerData.address;
    }
    if (buyerData.payment) {
      orderForm.payment = buyerData.payment as TPayment;
    }
    
    modal.content = orderForm.render();
    modal.open();
    isBasketOpen = false;
  });

  events.on('order:change', (data: { value: string }) => {
    buyer.setBuyerData({ address: data.value });
  });

  events.on('order:payment', (data: IOrderPaymentEvent) => {
    buyer.setBuyerData({ payment: data.value });
  });

  events.on('order:next', () => {
    const buyerData = buyer.getBuyerData();
    if (!buyerData.address || !buyerData.payment) {
      return;
    }
    
    const node = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const contactsForm = new ContactsForm(events, node);
    
    if (buyerData.phone) {
      contactsForm.phone = buyerData.phone;
    }
    if (buyerData.email) {
      contactsForm.email = buyerData.email;
    }
    
    modal.content = contactsForm.render();
    modal.open();
    isBasketOpen = false;
  });

  events.on('contacts:change', (data: IFormChangeData) => {
    buyer.setBuyerData({ [data.field]: data.value });
  });

  events.on('contacts:submit', async () => {
    const validation = buyer.validateBuyerData();
    if (!validation.isValid) {
      return;
    }

    const buyerData = buyer.getBuyerData();
    const orderItems = cart.getProductsFromCart().map(item => item.id);
    const totalPrice = cart.getTotalPrice();

    if (orderItems.length === 0) {
      return;
    }

    const orderData: IOrder = {
      payment: buyerData.payment,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address,
      items: orderItems,
      total: totalPrice
    };

    try {
      await api.postOrder(orderData);
      
      const node = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const success = new OrderSuccess(events, node);
      success.total = totalPrice;

      modal.content = success.render();
      modal.open();

      cart.clearCart();
      buyer.clearBuyerData();
      currentPreviewCard = null;
      currentPreviewProductId = null;
      isBasketOpen = false;
      
    } catch (error) {
      console.error('Order failed:', error);
    }
  });

  events.on('modal:close', () => {
    currentPreviewCard = null;
    currentPreviewProductId = null;
    isBasketOpen = false;
    modal.close();
  });

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