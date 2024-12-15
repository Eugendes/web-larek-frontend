import { BasketItems } from '../../types/types';

export class BasketController {
  private static instance: BasketController;
  private basketItems: BasketItems[] = [];

  private constructor() {}

  static getInstance(): BasketController {
    if (!BasketController.instance) {
      BasketController.instance = new BasketController();
    }
    return BasketController.instance;
  }

  getItems(): BasketItems[] {
    return this.basketItems;
  }

  addItem(item: BasketItems): void {
    if (!this.basketItems.some(basketItem => basketItem.id === item.id)) {
      this.basketItems.push(item);
      console.log('Добавлено в корзину:', this.basketItems);
    }
  }

  removeItem(id: string): void {
    this.basketItems = this.basketItems.filter(item => item.id !== id);
    console.log('После удаления:', this.basketItems);
  }

  clearBasket(): void {
    this.basketItems = [];
    console.log('Корзина очищена');
  }

  getTotalPrice(): number {
    return this.basketItems.reduce((total, item) => total + (item.price || 0), 0);
  }

  getItemCount(): number {
    return this.basketItems.length;
  }
}
