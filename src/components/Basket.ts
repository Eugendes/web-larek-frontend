import '../common.blocks/button.scss';
import { ModalManager } from './ModalManager';

const basketItems: { id: string; title: string; price: number | null }[] = [];

// Получение товаров в корзине
export function getBasketItems(): { id: string; title: string; price: number | null }[] {
  return basketItems;
}

// Добавление товара в корзину
export function addToBasket(item: { id: string; title: string; price: number | null }): void {
  const modalContainer = document.getElementById('modal-container') as HTMLElement;
  const modalManager = new ModalManager(modalContainer);

  if (!basketItems.some((basketItem) => basketItem.id === item.id)) {
    // Добавляем товар в корзину
    basketItems.push(item);
    updateBasketCounter();
    // Делаем кнопку неактивной
    const addButton = modalContainer.querySelector('.button') as HTMLButtonElement;
    if (addButton) {
      addButton.disabled = true;
    }

    // Закрываем модальное окно
    modalManager.closeModal();
  }
}

// Функция удаления item
export function removeFromBasket(id: string): void {
  const itemIndex = basketItems.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
      basketItems.splice(itemIndex, 1); 
      renderBasket(); 
      updateBasketCounter();
  }
}

// Функция для пересчёта корзины и итоговой суммы
export function renderBasket(): void {
  const basketList = document.querySelector('.basket__list') as HTMLElement;
  const basketPriceElem = document.querySelector('.basket__price') as HTMLElement;

  if (!basketList || !basketPriceElem) {
    // Убираем ошибку, если элементы не найдены
    console.warn('Элементы корзины не найдены. Рендеринг пропущен.');
    return;
  }

  basketList.innerHTML = ''; // Очищаем список

  if (basketItems.length === 0) {
    // Если корзина пуста, добавляем сообщение
    const emptyMessage = document.createElement('span');
    emptyMessage.classList.add('card__title');
    emptyMessage.textContent = 'Корзина пуста';
    basketList.appendChild(emptyMessage);

    // Обнуляем общую сумму
    basketPriceElem.textContent = '0 синапсов';
    return;
  }

  let totalPrice = 0;
  const template = document.getElementById('card-basket') as HTMLTemplateElement;

  basketItems.forEach((item, index) => {
    if (!template) return;

    const itemContent = template.content.cloneNode(true) as HTMLElement;
    const indexElem = itemContent.querySelector('.basket__item-index') as HTMLElement;
    const titleElem = itemContent.querySelector('.card__title') as HTMLElement;
    const priceElem = itemContent.querySelector('.card__price') as HTMLElement;
    const deleteButton = itemContent.querySelector('.basket__item-delete') as HTMLButtonElement;

    // Заполняем данные товара
    if (indexElem) indexElem.textContent = (index + 1).toString();
    if (titleElem) titleElem.textContent = item.title;
    if (priceElem) {
      if (item.price && item.price > 0) {
        const formattedPrice = item.price.toLocaleString('ru-RU');
        priceElem.textContent = `${formattedPrice} синапсов`;
        totalPrice += item.price;
      } else {
        priceElem.textContent = 'Бесценно';
      }
    }

    // Обработчик удаления
    if (deleteButton) {
      deleteButton.addEventListener('click', () => removeFromBasket(item.id));

    }
    basketList.appendChild(itemContent); // Добавляем товар в список
  });

  // Обновляем общую сумму
  basketPriceElem.textContent = `${totalPrice.toLocaleString('ru-RU')} синапсов`;
}

export function updateBasketCounter(): void {
  const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
  if (!basketCounter) {
    console.error('Счетчик корзины не найден');
    return;
  }
  basketCounter.textContent = basketItems.length.toString();
}

