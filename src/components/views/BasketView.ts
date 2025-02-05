import { BasketController } from '../controllers/BasketController';

export class BasketView {
  private controller: BasketController;

  constructor(controller: BasketController) {
    this.controller = controller;
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
    let totalPrice = 0;

    items.forEach((item, index) => {
      if (!template) return;

      const itemContent = template.content.cloneNode(true) as HTMLElement;
      const indexElem = itemContent.querySelector('.basket__item-index') as HTMLElement;
      const titleElem = itemContent.querySelector('.card__title') as HTMLElement;
      const priceElem = itemContent.querySelector('.card__price') as HTMLElement;

      if (indexElem) indexElem.textContent = (index + 1).toString();
      if (titleElem) titleElem.textContent = item.title;
      if (priceElem) {
        if (item.price && item.price > 0) {
          priceElem.textContent = `${item.price.toLocaleString('ru-RU')} синапсов`;
          totalPrice += item.price;
        } else {
          priceElem.textContent = 'Бесценно';
        }
      }

      const deleteButton = itemContent.querySelector('.basket__item-delete') as HTMLButtonElement;
      if (deleteButton) {
        deleteButton.addEventListener('click', () => {
                        this.controller.removeItem(item.id);
            this.renderBasket();
        });
    }
      basketList.appendChild(itemContent);
    });

    basketPriceElem.textContent = `${totalPrice.toLocaleString('ru-RU')} синапсов`;
    this.updateBasketCounter();
  }

  updateBasketCounter(): void {
    const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
    if (!basketCounter) {
      console.error('Счетчик корзины не найден');
      return;
    }
    //console.log('Обновление счетчика, текущее количество:', this.controller.getItemCount());
    basketCounter.textContent = this.controller.getItemCount().toString();
  }
}
