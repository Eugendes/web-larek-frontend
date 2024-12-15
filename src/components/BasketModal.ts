import { ModalManager } from './ModalManager';

export class BasketModal {
  private modalManager: ModalManager;
  private basketTemplate: HTMLTemplateElement;

  constructor(modalContainer: HTMLElement) {
    this.modalManager = new ModalManager(modalContainer);

    const template = document.getElementById('basket') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Шаблон корзины не найден');
    }
    this.basketTemplate = template;
  }

  // Метод для открытия корзины
  openBasket(items: { title: string; price: number | null }[]): void {
    const modalContent = this.basketTemplate.content.cloneNode(true) as HTMLElement;

    const basketList = modalContent.querySelector('.basket__list') as HTMLElement;
    const basketPrice = modalContent.querySelector('.basket__price') as HTMLElement;

    if (items.length > 0) {
      items.forEach((item) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.title} - ${item.price?.toLocaleString('ru-RU')} синапсов`;
        basketList.appendChild(listItem);
      });

      const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);
      basketPrice.textContent = `${totalPrice.toLocaleString('ru-RU')} синапсов`;
    } else {
      basketList.innerHTML = '<span class="card__title">Корзина пуста</span>';
    }

    this.modalManager.openModal(modalContent);
  }
}