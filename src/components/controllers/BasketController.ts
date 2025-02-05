import { BasketView } from '../views/BasketView';
import { BasketItems } from '../../types/types';

export class BasketController {
  private static instance: BasketController;
  private items: BasketItems[] = [];
  private view: BasketView;

  private constructor() {
    this.view = new BasketView(this);
  }

  public static getInstance(): BasketController {
    if (!BasketController.instance) {
      BasketController.instance = new BasketController();
    }
    return BasketController.instance;
  }

  addItem(item: BasketItems): void {
    const exists = this.items.some(existingItem => existingItem.id === item.id);
    if (exists) {
       return;
    }
    this.items.push(item);
     this.updateView();
}

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id);
    this.updateView();
  }


  getItems(): BasketItems[] {
    return this.items;
  }

  getItemCount(): number {
    return this.items.length;
  }

  clearBasket(): void {
    this.items = [];
    this.updateView();
  }

  private updateView(): void {
    this.view.updateBasketCounter();
    this.view.renderBasket();
  }
}

