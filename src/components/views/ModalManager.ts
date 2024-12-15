import { Api } from '../base/api';
import { BasketItems, Payment } from '../../types/types';
import { BasketView } from '../views/BasketView';
import { BasketController } from '../controllers/BasketController';

import { getBasketItems } from '../controllers/Basket';
import { listPreparatory } from '../getElements';

const basketController = BasketController.getInstance();
const basketView = new BasketView(basketController);
const api = new Api(`${process.env.API_ORIGIN}/api/weblarek`);

export class ModalManager {
  private modalContainer: HTMLElement;
  private orderData: Payment;

  constructor(modalContainer: HTMLElement) {
    this.modalContainer = modalContainer;
    this.orderData = {
      total: 0,
      payment: '',
      address: '',
      email: '',
      phone: '',
      items: [],
    };
    this.addEventListeners();
  }

  openModal(content: HTMLElement | BasketItems[]): void {
    const modalContentContainer = this.modalContainer.querySelector(
      '.modal__content'
    ) as HTMLElement;

    if (!modalContentContainer) {
      console.error('Не найден элемент .modal__content внутри modal-container');
      return;
    }

    modalContentContainer.innerHTML = '';

    if (Array.isArray(content)) {
      this.renderBasketModal(content, modalContentContainer);
    } else {
      modalContentContainer.appendChild(content);
    }

    this.modalContainer.classList.add('modal_active');

		
  }

  closeModal(): void {
    this.modalContainer.classList.remove('modal_active');
    const modalContentContainer = this.modalContainer.querySelector(
      '.modal__content'
    ) as HTMLElement;
    if (modalContentContainer) {
      modalContentContainer.innerHTML = '';
    }
  }

  private addEventListeners(): void {
    this.modalContainer.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.classList.contains('modal__close') ||
        target === this.modalContainer
      ) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  renderBasketModal(
    content: BasketItems[],
    modalContentContainer: HTMLElement
  ): void {
    const basketContainer = listPreparatory();
    const basketList = basketContainer.querySelector(
      '.basket__list'
    ) as HTMLElement;
    const template = document.getElementById(
      'card-basket'
    ) as HTMLTemplateElement;

    if (!template) {
      console.error('Не найден шаблон card-basket');
      return;
    }

    if (content.length === 0) {
      const emptyMessage = document.createElement('span');
      emptyMessage.classList.add('card__title');
      emptyMessage.textContent = 'Корзина пуста';
      basketList.appendChild(emptyMessage);
    } else {
      let totalPrice = 0;

      content.forEach((item, index) => {
        const itemContent = template.content.cloneNode(true) as HTMLElement;
        this.fillBasketItem(itemContent, item, index);
        basketList.appendChild(itemContent);
        if (item.price) {
          totalPrice += item.price;
        }
      });

      const basketPriceElem = basketContainer.querySelector(
        '.basket__price'
      ) as HTMLElement;

      if (basketPriceElem) {
        basketPriceElem.textContent = `${totalPrice.toLocaleString(
          'ru-RU'
        )} синапсов`;
      }
    }

    modalContentContainer.appendChild(basketContainer);

    const checkoutButton = modalContentContainer.querySelector(
      '.modal__actions .button'
    ) as HTMLButtonElement;

    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        this.handleCheckout(content);
      });
    }
  }

  private fillBasketItem(
    itemContent: HTMLElement,
    item: BasketItems,
    index: number
  ): void {
    const indexElem = itemContent.querySelector('.basket__item-index') as HTMLElement;
    const titleElem = itemContent.querySelector('.card__title') as HTMLElement;
    const priceElem = itemContent.querySelector('.card__price') as HTMLElement;

    if (indexElem) {
      indexElem.textContent = (index + 1).toString();
      indexElem.setAttribute('id', item.id);
    }
    if (titleElem) {
      titleElem.textContent = item.title;
    }
    if (priceElem) {
      const formattedPrice =
        item.price && item.price > 0
          ? `${item.price.toLocaleString('ru-RU')} синапсов`
          : 'Бесценно';
      priceElem.textContent = formattedPrice;
    }
  }

  private handleCheckout(content: BasketItems[]): void {
    const totalPrice = content.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
    const itemIds = content.map((item) => item.id);
    this.orderData.total = totalPrice;
    this.orderData.items = itemIds.map((id) => ({ id }));

    this.openOrderModal();
  }

  private openOrderModal(): void {
    const template = document.getElementById('order') as HTMLTemplateElement;

    if (!template) {
      console.error('Шаблон order не найден');
      return;
    }

    const orderContent = template.content.cloneNode(true) as HTMLElement;

    const paymentButtons = orderContent.querySelectorAll<HTMLButtonElement>(
      '.order__buttons .button'
    );
    const addressInput = orderContent.querySelector(
      '.form__input'
    ) as HTMLInputElement;
    const submitButton = orderContent.querySelector(
      '.order__button'
    ) as HTMLButtonElement;

    if (paymentButtons) {
      paymentButtons.forEach((button) => {
        button.addEventListener('click', () => {
          this.togglePaymentButton(paymentButtons, button);
          this.orderData.payment = button.name;
          this.checkOrderValidity(submitButton);
        });
      });
    }

    if (addressInput) {
      addressInput.addEventListener('input', () => {
        this.orderData.address = addressInput.value.trim();
        this.checkOrderValidity(submitButton);
      });
    }

    if (submitButton) {
      submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        this.openContactsModal();
      });
    }

    this.openModal(orderContent);
  }

  private openContactsModal(): void {
    const template = document.getElementById('contacts') as HTMLTemplateElement;

    if (!template) {
      console.error('Шаблон contacts не найден');
      return;
    }

    const contactsContent = template.content.cloneNode(true) as HTMLElement;
    const emailInput = contactsContent.querySelector(
      '.form__input[name="email"]'
    ) as HTMLInputElement;
    const phoneInput = contactsContent.querySelector(
      '.form__input[name="phone"]'
    ) as HTMLInputElement;
    const submitButton = contactsContent.querySelector(
      '.button'
    ) as HTMLButtonElement;
    const errorSpan = contactsContent.querySelector(
      '.form__errors'
    ) as HTMLSpanElement;

    emailInput.addEventListener('input', () => {
      this.orderData.email = emailInput.value.trim();
      this.validateContactsForm(errorSpan, submitButton);
    });

    phoneInput.addEventListener('input', () => {
      this.orderData.phone = phoneInput.value.trim();
      this.validateContactsForm(errorSpan, submitButton);
    });

    if (submitButton) {
      submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
        await this.submitOrder();
      });
    }

    this.openModal(contactsContent);
  }

  private validateContactsForm(
    errorSpan: HTMLElement | null,
    submitButton: HTMLButtonElement | null
  ): void {
    const emailValid = this.validateEmail(this.orderData.email);
    const phoneValid = this.validatePhone(this.orderData.phone);

    if (errorSpan) {
      errorSpan.textContent = '';
      if (!emailValid) {
        errorSpan.textContent = 'Введите корректный Email.';
      } else if (!phoneValid) {
        errorSpan.textContent = 'Введите корректный номер телефона.';
      }
    }

    if (submitButton) {
      submitButton.disabled = !(emailValid && phoneValid);
    }
  }

  private async submitOrder(): Promise<void> {
    try {
			const formattedData = this.formatOrderData(this.orderData);
			const response = await api.post<Payment>("/order", formattedData);
			this.openSuccessModal();
		} catch (error) {
			console.error('Ошибка при отправке заказа:', error);
		}
  }

  private openSuccessModal(): void {
    const template = document.getElementById('success') as HTMLTemplateElement;

    if (!template) {
      console.error('Не найден шаблон success');
      return;
    }

    const modalContent = template.content.cloneNode(true) as HTMLElement;
    const descriptionElem = modalContent.querySelector(
      '.order-success__description'
    ) as HTMLElement;

    if (descriptionElem) {
      descriptionElem.textContent = `Списано ${this.orderData.total.toLocaleString(
        'ru-RU'
      )} синапсов`;
    }

    this.openModal(modalContent);

    setTimeout(() => {
      const closeButton = this.modalContainer.querySelector(
        '.order-success__close'
      ) as HTMLButtonElement;
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          this.closeModal();
          this.clearBasket();
        });
      } else {
        console.error('Кнопка закрытия не найдена');
      }
    }, 0);
  }

  private clearBasket(): void {
    basketController.clearBasket();
    basketView.renderBasket();
    basketView.updateBasketCounter();
}

  private togglePaymentButton(
    buttons: NodeListOf<HTMLButtonElement>,
    clickedButton: HTMLButtonElement
  ): void {
    buttons.forEach((button) => {
      if (button === clickedButton) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  private checkOrderValidity(submitButton: HTMLButtonElement | null): void {
    if (!submitButton) return;
    submitButton.disabled = !(
      this.orderData.payment && this.orderData.address.trim()
    );
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
    return phoneRegex.test(phone);
  }

  private formatOrderData(
    orderData: Payment
  ): Omit<Payment, 'items'> & { items: string[] } {
    return {
      payment: orderData.payment,
      address: orderData.address,
      email: orderData.email,
      phone: orderData.phone,
      total: orderData.total,
      items: orderData.items.map((item) => item.id),
    };
  }
}
