import { ModalManager } from './ModalManager';
import { BasketController } from '../controllers/BasketController';
import { BasketView } from '../views/BasketView';

export class BasketModal {
  private modalManager: ModalManager;
  private basketTemplate: HTMLTemplateElement;
  private basketController: BasketController;
  private basketView: BasketView;

  constructor(modalContainer: HTMLElement, basketController: BasketController) {
    this.modalManager = new ModalManager(modalContainer);
    this.basketController = basketController;
    this.basketView = new BasketView(this.basketController);

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

    // Вставляем содержимое корзины в модальное окно
    const modalContainer = document.querySelector('.modal__content') as HTMLElement;
    if (!modalContainer) {
      console.error('BasketModal: .modal__content не найдено');
      return;
    }

    modalContainer.innerHTML = ''; // Очищаем модальное окно
    modalContainer.appendChild(modalContent);

    // Вызываем рендер корзины
    this.basketView.renderBasket();

    // Открываем модальное окно через ModalManager
    this.modalManager.openModal(modalContainer);
    
  }
}

