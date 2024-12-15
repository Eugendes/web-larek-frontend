import './scss/styles.scss';
import { GoodsController } from './components/controllers/GoodsController';
import { getBasketItems, removeFromBasket } from './components/controllers/Basket';
import { ModalManager } from './components/views/ModalManager';
import { listPreparatory } from './components/getElements';

import { BasketView } from './components/views/BasketView';
import { BasketController } from './components/controllers/BasketController';

const goodsController = new GoodsController();

const basketController = BasketController.getInstance();
const basketView = new BasketView(basketController);

// Загружаем продукты после загрузки DOM
window.addEventListener('DOMContentLoaded', () => {
  goodsController.loadAndRenderProducts();
});

// Функция для открытия корзины
function openBasket(): void {
  const modalContainer = document.getElementById('modal-container') as HTMLElement;
  const modalContentContainer = modalContainer.querySelector('.modal__content') as HTMLElement;

  if (!modalContentContainer) {
    console.error('Не найден контейнер для содержимого модального окна');
    return;
  }

  // Получаем заготовку списка из функции listPreparatory
  const basketContainer = listPreparatory();

  // Очищаем модальное содержимое и добавляем заготовку
  modalContentContainer.innerHTML = '';
  modalContentContainer.appendChild(basketContainer);

  // Получаем текущие товары в корзине
  const items = getBasketItems();
  // Указываем содержимое для отображения в модальном окне
  const modalManager = new ModalManager(document.getElementById('modal-container') as HTMLElement);
  modalManager.openModal(items); // Передаем текущие товары

  
  const butDel = modalContentContainer.querySelectorAll('.basket__item-delete');
  if (butDel) {
    butDel.forEach((deleteButton) => {
      deleteButton.addEventListener('click', () => {
        // Находим родительский элемент кнопки, чтобы получить соответствующий item-index
        const basketItem = deleteButton.closest('.basket__item') as HTMLElement;
        if (basketItem) {
          const itemElement = basketItem.querySelector('.basket__item-index') as HTMLElement;
          if (itemElement) {
            const itemId = itemElement.getAttribute('id');
            if (itemId) {
              removeFromBasket(itemId);
              basketView.renderBasket();
            } else {
              console.error('ID не найден на элементе item-index');
            }
          } else {
            console.error('Элемент item-index не найден внутри basket__item');
          }
        } else {
          console.error('Родительский элемент basket__item не найден');
        }
      });
    });
  }
}

// Навешиваем обработчик на кнопку корзины
const basketButton = document.querySelector('.header__basket') as HTMLElement;
if (basketButton) {
  basketButton.addEventListener('click', openBasket);
}

