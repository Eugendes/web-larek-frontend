import { Api } from './base/api';
import { BasketItem, Payment } from '../types/types';
import {
	removeFromBasket,
	getBasketItems,
	renderBasket,
	updateBasketCounter,
} from './Basket';
import { listPreparatory } from './getElements';
import { ORDER_URL } from '../utils/constants';

const api = new Api(`${process.env.API_ORIGIN}/api/weblarek`);

// Объект с данными заказа
const orderData: Payment = {
	total: 0, // Сумма заказа
	payment: '', // Выбранный тип оплаты
	address: '', // Адрес доставки
	email: '', // Почта получателя
	phone: '', // Номер телефона получателя
	items: [], // Список выбранных товаров
};

export class ModalManager {
	private modalContainer: HTMLElement;

	constructor(modalContainer: HTMLElement) {
		this.modalContainer = modalContainer;
		this.addEventListeners();
	}

	// Открытие модального окна
	openModal(content: HTMLElement | BasketItem[]): void {
		const modalContentContainer = this.modalContainer.querySelector(
			'.modal__content'
		) as HTMLElement;
		if (!modalContentContainer) {
			console.error('Не найден элемент .modal__content внутри modal-container');
			return;
		}

		modalContentContainer.innerHTML = '';

		if (Array.isArray(content)) {
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
					const indexElem = itemContent.querySelector(
						'.basket__item-index'
					) as HTMLElement;
					const titleElem = itemContent.querySelector(
						'.card__title'
					) as HTMLElement;
					const priceElem = itemContent.querySelector(
						'.card__price'
					) as HTMLElement;

					if (indexElem) {
						indexElem.textContent = (index + 1).toString();
						indexElem.setAttribute('id', item.id);
					}
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

					basketList.appendChild(itemContent); // Добавляем в список
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

			modalContentContainer.appendChild(basketContainer); // Добавляем корзину в модальное окно

			// Обработчик для кнопки оформить
			if (content.length !== 0) {
				const checkoutButton = modalContentContainer.querySelector(
					'.modal__actions .button'
				) as HTMLButtonElement;

				checkoutButton.addEventListener('click', () => {
					const totalPrice = content.reduce(
						(sum, item) => sum + (item.price || 0),
						0
					);
					const itemIds = content.map((item) => item.id);
					orderData.total = totalPrice;
					orderData.items = itemIds.map((id) => ({ id }));

					handleCheckout();
				});
			}
		} else {
			modalContentContainer.appendChild(content);
		}

		this.modalContainer.classList.add('modal_active');

		// Обработчик для кнопок удаления товаров
		const deleteButtons = modalContentContainer.querySelectorAll(
			'.basket__item-delete'
		);
		deleteButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const itemId = button
					.closest('.basket__item')
					?.querySelector('.basket__item-index')
					?.getAttribute('id');
				if (itemId) {
					removeFromBasket(itemId);
				}
			});
		});
	}

  	// Закрытие модального окна
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
}

export function handleCheckout(): void {
	const modalContainer = document.getElementById(
		'modal-container'
	) as HTMLElement;

	// Обнуляем данные формы заказа
	orderData.payment = '';
	orderData.address = '';

	// Закрываем текущую модалку корзины
	const modalManager = new ModalManager(modalContainer);
	modalManager.closeModal();

	// Открываем новую модалку с формой заказа
	const template = document.getElementById('order') as HTMLTemplateElement;
	if (!template) {
		console.error('Шаблон order не найден');
		return;
	}

	const orderContent = template.content.cloneNode(true) as HTMLElement;

	// Навешиваем обработчики на кнопки выбора способа оплаты
	const paymentButtons = orderContent.querySelectorAll<HTMLButtonElement>(
		'.order__buttons .button'
	);
	paymentButtons.forEach((button) => {
		button.addEventListener('click', () => {
			togglePaymentButton(paymentButtons, button); // Переключаем активность кнопок
			orderData.payment = button.name; // Сохраняем выбранный способ оплаты
			checkOrderValidity(); // Проверяем валидность
		});
	});

	// Навешиваем обработчик на поле ввода адреса
	const addressInput = orderContent.querySelector(
		'.form__input'
	) as HTMLInputElement;
	if (addressInput) {
		addressInput.addEventListener('input', () => {
			orderData.address = addressInput.value.trim(); // Сохраняем адрес
			checkOrderValidity(); // Проверяем валидность
		});
	}

	// Навешиваем обработчик на кнопку "Далее"
	const submitButton = orderContent.querySelector(
		'.order__button'
	) as HTMLButtonElement;
	if (submitButton) {
		submitButton.addEventListener('click', (event) => {
			event.preventDefault();
			handleOrderNext();
		});
	}

	modalManager.openModal(orderContent);
}

function handleOrderNext(): void {
	const modalContainer = document.getElementById(
		'modal-container'
	) as HTMLElement;

	// Обнуляем данные формы контактов
	orderData.email = '';
	orderData.phone = '';

	// Закрываем текущую модалку
	const modalManager = new ModalManager(modalContainer);
	modalManager.closeModal();

	// Открываем новую модалку для контактов
	const template = document.getElementById('contacts') as HTMLTemplateElement;
	if (!template) {
		console.error('Шаблон contacts не найден');
		return;
	}

	const contactsContent = template.content.cloneNode(true) as HTMLElement;

	// Добавляем валидацию для полей email и phone
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
		orderData.email = emailInput.value.trim();
		validateContactsForm();
	});

	phoneInput.addEventListener('input', () => {
		orderData.phone = phoneInput.value.trim();
		validateContactsForm();
	});

	// Валидация формы
	function validateContactsForm(): void {
		const emailValid = validateEmail(orderData.email);
		const phoneValid = validatePhone(orderData.phone);

		errorSpan.textContent = '';

		if (!emailValid) {
			errorSpan.textContent = 'Введите корректный Email.';
		} else if (!phoneValid) {
			errorSpan.textContent = 'Введите корректный номер телефона.';
		}

		submitButton.disabled = !(emailValid && phoneValid);
	}

	// Обработчик для кнопки "Оплатить"
	if (submitButton) {
    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();

        // Форматируем данные перед отправкой
        const formattedData = formatOrderData(orderData);

        await sendOrder(formattedData); // Отправляем отформатированные данные
        console.log('Отправленные данные:', formattedData);

        handlePayment(); // Открываем следующую модалку
    });
}

	modalManager.openModal(contactsContent);
}

function handlePayment() {
	// Получаем данные о цене из orderData
	const totalPrice = orderData.total;

	// Ищем шаблон последней модалки
	const template = document.getElementById('success') as HTMLTemplateElement;
	if (!template) {
		console.error('Не найден шаблон success');
		return;
	}

	// Клонируем содержимое шаблона
	const modalContent = template.content.cloneNode(true) as HTMLElement;

	// Находим элемент с описанием и вставляем сумму
	const descriptionElem = modalContent.querySelector(
		'.order-success__description'
	) as HTMLElement;
	if (descriptionElem) {
		descriptionElem.textContent = `Списано ${totalPrice.toLocaleString(
			'ru-RU'
		)} синапсов`;
	}

	// Инициализируем модальное окно
	const modalContainer = document.getElementById(
		'modal-container'
	) as HTMLElement;
	const modalManager = new ModalManager(modalContainer);

	modalManager.openModal(modalContent);

	// Перемещаем обработчик на момент после вставки в DOM
	setTimeout(() => {
		const closeButton = modalContainer.querySelector(
			'.order-success__close'
		) as HTMLButtonElement;
		if (closeButton) {
			closeButton.addEventListener('click', () => {
				modalManager.closeModal();
				clearBasket();
			});
		} else {
			console.error('Кнопка закрытия не найдена');
		}
	}, 0);
}

function clearBasket(): void {
	const basketCounter = getBasketItems();
	if (basketCounter.length === 0) return;
	basketCounter.length = 0;
	renderBasket();
	updateBasketCounter();
}

function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
	const phoneRegex = /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/;
	return phoneRegex.test(phone);
}

function togglePaymentButton(
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

function checkOrderValidity(): void {
	const submitButton = document.querySelector(
		'.order__button'
	) as HTMLButtonElement;
	if (!submitButton) return;

	// Если выбраны способ оплаты и адрес, активируем кнопку
	if (orderData.payment && orderData.address.trim()) {
		submitButton.disabled = false;
	} else {
		submitButton.disabled = true;
	}
}

export async function sendOrder(orderData: Omit<Payment, 'items'> & { items: string[] }): Promise<void> {
  try {
      const response = await fetch(ORDER_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
      });

      if (!response.ok) {
          throw new Error(`Ошибка при отправке заказа: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Заказ успешно отправлен:', responseData);
  } catch (error) {
      console.error('Ошибка отправки заказа:', error);
  }
}

function formatOrderData(orderData: Payment): Omit<Payment, 'items'> & { items: string[] } {
  return {
      payment: orderData.payment,
      address: orderData.address,
      email: orderData.email,
      phone: orderData.phone,
      total: orderData.total,
      items: orderData.items.map(item => item.id), // Преобразуем массив объектов в массив ID
  };
}