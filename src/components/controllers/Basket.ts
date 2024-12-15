import { BasketController } from './BasketController';
import { BasketView } from '../views/BasketView';
import { BasketItems } from '../../types/types';

const controller = new BasketController();
const view = new BasketView(controller);

// Добавить товар в корзину
export function addToBasket(item: BasketItems): void {
  controller.addItem(item);
  view.updateBasketCounter();
  view.renderBasket();
}

// Удалить товар из корзины
export function removeFromBasket(id: string): void {
  controller.removeItem(id);
  view.updateBasketCounter();
  //view.renderBasket();
}

// Получить список товаров
export function getBasketItems(): BasketItems[] {
  return controller.getItems();
}

// Очистить корзину
export function clearBasket(): void {
  controller.clearBasket();
  view.updateBasketCounter();
  view.renderBasket();
}
