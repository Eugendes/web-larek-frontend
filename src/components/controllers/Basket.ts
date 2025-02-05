import { BasketController } from './BasketController';
import { BasketItems } from '../../types/types';

const controller = BasketController.getInstance();

// Добавить товар в корзину
export function addToBasket(item: BasketItems): void {
  controller.addItem(item);
}

// Удалить товар из корзины
export function removeFromBasket(id: string): void {
  controller.removeItem(id);
}

// Получить список товаров
export function getBasketItems(): BasketItems[] {
  return controller.getItems();
}

// Очистить корзину
export function clearBasket(): void {
  controller.clearBasket();
}
