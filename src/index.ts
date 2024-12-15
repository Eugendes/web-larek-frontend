import './scss/styles.scss';
import { GoodsController } from './components/controllers/GoodsController';
import { getBasketItems } from './components/controllers/Basket';
import { ModalManager } from './components/views/ModalManager';
import { listPreparatory } from './components/getElements';

const goodsController = new GoodsController();

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
}

// Навешиваем обработчик на кнопку корзины
const basketButton = document.querySelector('.header__basket') as HTMLElement;
if (basketButton) {
  basketButton.addEventListener('click', openBasket);
}

