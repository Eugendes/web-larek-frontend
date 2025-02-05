import { BasketController } from '../controllers/BasketController';

export class BasketView {
  private controller: BasketController;
  private basketCounter: HTMLElement | null;

  constructor(controller: BasketController) {
    this.controller = controller;
    this.basketCounter = document.querySelector('.header__basket-counter');

    // Навешиваем обработчик удаления на весь документ (event delegation)
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('basket__item-delete')) {
        const itemId = target.getAttribute('data-id');
        if (itemId) {
          this.controller.removeItem(itemId);
          this.renderBasket();
        }
      }
    });
  }

  renderBasket(): void {
    const basketList = document.querySelector('.basket__list') as HTMLElement;
    const basketPriceElem = document.querySelector('.basket__price') as HTMLElement;

    if (!basketList || !basketPriceElem) {
      return;
    }

    basketList.innerHTML = '';
    const items = this.controller.getItems();

    if (items.length === 0) {
      const emptyMessage = document.createElement('span');
      emptyMessage.classList.add('card__title');
      emptyMessage.textContent = 'Корзина пуста';
      basketList.appendChild(emptyMessage);
      basketPriceElem.textContent = '0 синапсов';
      this.updateBasketCounter();
      return;
    }

    const template = document.getElementById('card-basket') as HTMLTemplateElement;
    if (!template) {
      console.error('BasketView: Шаблон card-basket не найден');
      return;
    }

    let totalPrice = 0;
    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const itemContent = template.content.cloneNode(true) as HTMLElement;
      const indexElem = itemContent.querySelector('.basket__item-index') as HTMLElement;
      const titleElem = itemContent.querySelector('.card__title') as HTMLElement;
      const priceElem = itemContent.querySelector('.card__price') as HTMLElement;
      const deleteButton = itemContent.querySelector('.basket__item-delete') as HTMLButtonElement;

      if (indexElem) indexElem.textContent = (index + 1).toString();
      if (titleElem) titleElem.textContent = item.title;
      if (priceElem) {
        priceElem.textContent = item.price && item.price > 0
          ? `${item.price.toLocaleString('ru-RU')} синапсов`
          : 'Бесценно';
        totalPrice += item.price ?? 0;
      }

      if (deleteButton) {
        deleteButton.setAttribute('data-id', item.id);
      }

      fragment.appendChild(itemContent);
    });

    basketList.appendChild(fragment);
    basketPriceElem.textContent = `${totalPrice.toLocaleString('ru-RU')} синапсов`;

    this.updateBasketCounter();
  }

  updateBasketCounter(): void {
    if (!this.basketCounter) {
      this.basketCounter = document.querySelector('.header__basket-counter');
    }
    if (!this.basketCounter) {
      console.error('BasketView: Счетчик корзины не найден');
      return;
    }
    this.basketCounter.textContent = this.controller.getItemCount().toString();
  }
}
