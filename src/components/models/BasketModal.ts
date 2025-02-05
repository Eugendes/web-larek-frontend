import { ModalManager } from '../views/ModalManager';
import { BasketView } from '../views/BasketView';

export class BasketModal {
  private modalManager: ModalManager;
  private basketTemplate: HTMLTemplateElement;
  private basketView: BasketView;

  constructor(modalManager: ModalManager, basketView: BasketView) {
    this.modalManager = modalManager;
    this.basketView = basketView;

    const template = document.getElementById('basket') as HTMLTemplateElement;
    if (!template) {
      throw new Error('Шаблон корзины не найден');
    }
    this.basketTemplate = template;
  }

  // Метод для открытия корзины
  openBasket(): void {
    // Подготавливаем контент модального окна
    const modalContent = this.basketTemplate.content.cloneNode(true) as HTMLElement;

    // Получаем контейнер модального окна через ModalManager
    const modalContainer = this.modalManager.getModalContainer();
    if (!modalContainer) {
      console.error('BasketModal: modalContainer не найдено');
      return;
    }

    modalContainer.innerHTML = ''; // Очищаем модальное окно
    modalContainer.appendChild(modalContent);

    // Вызываем рендер корзины
    this.basketView.renderBasket();

    // Открываем модальное окно через ModalManager
    this.modalManager.openModal();
  }
}
