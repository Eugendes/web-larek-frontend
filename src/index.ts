import './scss/styles.scss';
import { goodsService } from './components/cardGoods';
import { IGoods } from './types/types';
import { ModalManager } from './components/ModalManager';
import { BasketModal } from './components/BasketModal';

// Загружаем продукты после загрузки DOM
window.addEventListener('DOMContentLoaded', loadProducts);

const modalContainer = document.getElementById('modal-container') as HTMLElement;
const modalManager = new ModalManager(modalContainer);
const basketModal = new BasketModal(modalContainer);

async function loadProducts() {
  try {
    const products: IGoods[] = await goodsService.fetchProducts();
    goodsService.renderProducts(products);
  } catch (error) {
    console.error('Ошибка при отображении', error);
  }
}

// Пример открытия модального окна с контентом
document.querySelector('.open-modal-btn')?.addEventListener('click', () => {
  const content = document.createElement('div');
  content.textContent = 'Пример контента модального окна';
  modalManager.openModal(content);
});

const basketButton = document.querySelector('.header__basket') as HTMLElement;
if (basketButton) {
  basketButton.addEventListener('click', () => {
    const basketItems = getBasketItems(); // Замените на вашу логику получения товаров из корзины
    basketModal.openBasket(basketItems);
  });
}

// Пример функции получения товаров
function getBasketItems(): { title: string; price: number | null }[] {
  return [
  ]; // Замените на вашу реальную логику
}