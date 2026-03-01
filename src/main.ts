import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Catalog } from './components/Models/Catalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';
import { AppApi } from './components/Models/AppApi';
import { Api } from './components/base/Api';
import { API_URL} from './utils/constants';

const catalog = new Catalog();
const cart = new ShoppingCart();
const buyer = new Buyer();

const apiBase = new Api(API_URL);
const appApi = new AppApi(apiBase);

async function loadData() {
  const testProducts = apiProducts.items;
  
  console.log('Тестовые товары:', testProducts);
  
  console.log('Сохраняем товары в модель Catalog');
  catalog.setProducts(testProducts);
  
  console.log(catalog.getProducts());
  
  
  if (testProducts.length > 0) {
    const firstProduct = testProducts[0];
    console.log(`\nПроверка getProductById с ID "${firstProduct.id}":`);
    console.log(catalog.getProductById(firstProduct.id));
    
    console.log('\nПроверка методов детального просмотра:');
    catalog.setProductDetailed(firstProduct);
    console.log('Детальный товар:', catalog.getProductDetailed());
  }
  
  return testProducts;
}

async function fetchFromServer() {
  try {
    const serverProducts = await appApi.getProductList(); 
    
    const productsToSave = serverProducts.length > 0 ? serverProducts : apiProducts.items;
    
    console.log('Получены товары (через AppApi):', productsToSave);
    catalog.setProducts(productsToSave);
    
    console.log('товары в модели после сохранения:');
    console.log(catalog.getProducts());
    
    console.log('Данные успешно загружены через AppApi и сохранены!');
    
    return productsToSave;
  } catch (error) {
    console.error('Ошибка при запросе через AppApi:');
    return null;
  }
}

function testBuyerValidation() {
  //Пустой покупатель
  console.log('\n1. Пустой покупатель:');
  buyer.clearBuyerData();
  console.log('Данные:', buyer.getBuyerData());
  console.log('Результат:', buyer.validateBuyerData());
  
  //Только email
  console.log('\n2. Только email:');
  buyer.setBuyerData({ email: 'test@example.com' });
  console.log('Данные:', buyer.getBuyerData());
  console.log('Результат:', buyer.validateBuyerData());
  
  //Email и телефон
  console.log('\n3. Email и телефон:');
  buyer.setBuyerData({ 
    email: 'test@example.com',
    phone: '+71234567890' 
  });
  console.log('Данные:', buyer.getBuyerData());
  console.log('Результат:', buyer.validateBuyerData());
  
  //Email, телефон и адрес
  console.log('\n4. Email, телефон и адрес:');
  buyer.setBuyerData({ 
    email: 'test@example.com',
    phone: '+71234567890',
    address: 'ул. Пушкина, д. 10'
  });
  console.log('Данные:', buyer.getBuyerData());
  console.log('Результат:', buyer.validateBuyerData());
  
  //Все поля, кроме payment
  console.log('\n5. Все поля, кроме payment:');
  buyer.setBuyerData({ 
    email: 'test@example.com',
    phone: '+71234567890',
    address: 'ул. Пушкина, д. 10'
    // payment отсутствует
  });
  console.log('Данные:', buyer.getBuyerData());
  console.log('Результат:', buyer.validateBuyerData());
  
  //Только payment
  console.log('\n6. Только payment:');
  buyer.clearBuyerData();
  buyer.setBuyerData({ payment: 'card' });
  console.log('Данные:', buyer.getBuyerData());
  console.log('Результат:', buyer.validateBuyerData());
  
  //Все поля полностью
  console.log('\n7. Все поля полностью (валидные данные):');
  buyer.setBuyerData({
    email: 'test@example.com',
    phone: '+71234567890',
    payment: 'card',
    address: 'ул. Пушкина, д. 10'
  });
  console.log('Данные:', buyer.getBuyerData());
  console.log('Результат:', buyer.validateBuyerData());
  
}

async function main() {
  const serverProducts = await fetchFromServer();
  
  if (!serverProducts) {
    await loadData();
  }

  const products = catalog.getProducts();
  if (products.length >= 2) {
    cart.addProductToCart(products[0]);
    cart.addProductToCart(products[1]);
    cart.addProductToCart(products[0]);
    
    console.log('Товары в корзине:', cart.getProductsFromCart());
    console.log('Общая стоимость:', cart.getTotalPrice());
    console.log('Количество товаров:', cart.getProductCount());
  }
  
  testBuyerValidation();
}

main().catch(error => {
  console.error('Ошибка:', error);
});
