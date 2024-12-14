export class ModalManager {
  private modalContainer: HTMLElement;

  constructor(modalContainer: HTMLElement) {
    this.modalContainer = modalContainer;

    // Добавляем слушатели событий
    this.addEventListeners();
  }

  openModal(content: HTMLElement): void {
    const modalContentContainer = this.modalContainer.querySelector('.modal__content') as HTMLElement;
    if (!modalContentContainer) {
      console.error('Не найден элемент .modal__content внутри modal-container');
      return;
    }

    modalContentContainer.innerHTML = '';
    modalContentContainer.appendChild(content);

    this.modalContainer.classList.add('modal_active'); // Добавляем класс для открытия модального окна
  }

  closeModal(): void {
    this.modalContainer.classList.remove('modal_active'); // Убираем класс для закрытия модального окна
    const modalContentContainer = this.modalContainer.querySelector('.modal__content') as HTMLElement;
    if (modalContentContainer) {
      modalContentContainer.innerHTML = ''; // Очищаем содержимое
    }
  }

  private addEventListeners(): void {
    // Закрытие по клику на кнопку закрытия
    this.modalContainer.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('modal__close') || target === this.modalContainer) {
        this.closeModal();
      }
    });

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    });
  }
}
