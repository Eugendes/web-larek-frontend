import { BasketItems } from '../../types/types';

export class BasketController {
  private basketItems: BasketItems[] = [];

  getItems(): BasketItems[] {
    console.log(this.basketItems);
    
    return this.basketItems;
  }

  addItem(item: BasketItems): void {
    if (!this.basketItems.some(basketItem => basketItem.id === item.id)) {
      this.basketItems.push(item);
    }
  }

  removeItem(id: string): void {
    this.basketItems = this.basketItems.filter(item => item.id !== id);
  }

  clearBasket(): void {
    this.basketItems = [];
  }

  getTotalPrice(): number {
    return this.basketItems.reduce((total, item) => total + (item.price || 0), 0);
  }

  getItemCount(): number {
    return this.basketItems.length;
  }
}
