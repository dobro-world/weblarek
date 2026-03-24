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
}

main().catch(error => {
  console.error('Ошибка:', error);
});
