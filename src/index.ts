import './scss/styles.scss';
import { goodsService } from './components/cardGoods';
import { IGoods } from './types/types';
import { getBasketItems } from './components/Basket';
import { ModalManager } from './components/ModalManager';
import { listPreparatory } from './components/getElements';


// Загружаем продукты после загрузки DOM
window.addEventListener('DOMContentLoaded', loadProducts);

async function loadProducts() {
  try {
    const products: IGoods[] = await goodsService.fetchProducts();
    goodsService.renderProducts(products);
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
  }
}

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
  modalManager.openModal(getBasketItems());
}

// Навешиваем обработчик на кнопку корзины
const basketButton = document.querySelector('.header__basket') as HTMLElement;
if (basketButton) {
  basketButton.addEventListener('click', openBasket);
}
