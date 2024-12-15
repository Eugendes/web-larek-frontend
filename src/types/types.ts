
type CategoryType = 
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

  // функиция для цветов блоков категория
  export function mapCategoryToClass(category: CategoryType): string {
    switch (category) {
      case 'софт-скил':
        return 'card__category_soft';
      case 'другое':
        return 'card__category_other';
      case 'дополнительное':
        return 'card__category_additional';
      case 'кнопка':
        return 'card__category_button';
      case 'хард-скил':
        return 'card__category_hard';
      default:
        return '';
    }
  }

export interface IGoods {
  id: string; //id товара
  category: CategoryType; //категория товара
  title: string; //название товара
  image: string; //картинка товара
  price: number | null; //цена
  description: string; //описание товара
}

export interface IGoodSelect {
  id: string; //id товара
  category: string; //категория товара
  title: string; //название товара
  image: string; //картинка товара
  description: string; //описание товара
  price: number | null; //цена
}

export interface BasketItem {
  id: string;
  title: string;
  price: number | null;
}

export interface Payment {
  total: number; // Сумма заказа
  payment: string;    // Выбранный тип оплаты
  address: string;    // Адрес доставки
  email: string;      // Почта получателя
  phone: string;      // Номер телефона получателя
  items: { id: string }[]; // Массив выбранных товаров
}

export interface OrderResponse {
  id: string;
  total: number;
}

/*
export interface Basket {
  basketGoods: Goods[]; //выбранные товары(массив данных)
  priceTotal: number; //общая цена товаров 
}



export interface PurchasingProcess {
  basketGoods: Goods[]; //доступные товары(массив данных)
  basket: Basket; //выбранные товары
}
*/
/*........................................СОБЫТИЯ, ПРОИСХОДЯЩИЕ НА СТРАНИЦЕ..............................................*/
/*
export enum Events {
  // События объекта товары
  PRODUCT_SELECTED = 'product:selected',         // Товар выбран для просмотра
  PRODUCT_ADDED = 'product:added',               // Товар добавлен в корзину
  PRODUCT_REMOVED = 'product:removed',           // Товар удалён из корзины
  
  // События объекта корзина
  BASKET_UPDATED = 'basket:updated',             // Обновление содержимого корзины
  BASKET_CLEARED = 'basket:cleared',             // Очистка корзины
  
  // События модальных окон(оформления заказа)
  MODAL_OPENED = 'modal:opened',                   // Модальное окно открыто
  MODAL_CLOSED = 'modal:closed',                   // Модальное окно закрыто
  PAYMENT_DETAILS_UPDATED = 'payment:detailsUpdated', // Обновлены данные для оплаты
  PAYMENT_TYPE_SELECTED = 'payment:typeSelected',     // Выбран тип оплаты
  PAYMENT_RESET = 'payment:reset',                   // Данные оплаты сброшены

  // События заказов
  ORDER_SUCCESS = 'order:success',                 // Заказ успешно оформлен
  ORDER_FAILED = 'order:failed',                   // Ошибка при оформлении заказа
}
*/
/*..............................................ИНТЕРФЕЙСЫ ДЛЯ СОБЫТИЙ...................................................*/
/*
// Интерфейс для события выбора товара для просмотра
export interface ProductSelectedEvent {
  type: Events.PRODUCT_SELECTED;
  payload: {
    productId: string;
  };
}

// Интерфейс для события добавления товара в корзину
export interface ProductAddedEvent {
  type: Events.PRODUCT_ADDED;
  payload: {
    productId: string;
    quantity: number;
  };
}

// Интерфейс для события удаления товара из корзины
export interface ProductRemovedEvent {
  type: Events.PRODUCT_REMOVED;
  payload: {
    productId: string;
  };
}

// Интерфейс для события обновления корзины
export interface BasketUpdatedEvent {
  type: Events.BASKET_UPDATED;
  payload: {
    totalItems: number;
    totalPrice: number;
  };
}

// Интерфейс для события очистки корзины
export interface BasketClearedEvent {
  type: Events.BASKET_CLEARED;
  payload: null;
}

// Интерфейс для события открытия модального окна
export interface ModalOpenedEvent {
  type: Events.MODAL_OPENED;
  payload: {
    modalType: string; // Тип модального окна (например, "product" или "basket")
  };
}

// Интерфейс для события закрытия модального окна
export interface ModalClosedEvent {
  type: Events.MODAL_CLOSED;
  payload: null;
}

// Интерфейс для события обновления данных для оплаты
export interface PaymentDetailsUpdatedEvent {
  type: Events.PAYMENT_DETAILS_UPDATED;
  payload: {
    address: string; // Адрес доставки
    email: string;   // Электронная почта
    phone: string;   // Номер телефона
  };
}

// Интерфейс для события выбора типа оплаты
export interface PaymentTypeSelectedEvent {
  type: Events.PAYMENT_TYPE_SELECTED;
  payload: {
    paymentType: 'online' | 'onDelivery'; // Тип оплаты
  };
}

// Интерфейс для события сброса данных оплаты
export interface PaymentResetEvent {
  type: Events.PAYMENT_RESET;
  payload: null;
}

// Интерфейс для события успешного оформления заказа
export interface OrderSuccessEvent {
  type: Events.ORDER_SUCCESS;
  payload: {
    orderId: string;  // Идентификатор заказа
    totalPrice: number; // Итоговая стоимость заказа
  };
}

// Интерфейс для события ошибки оформления заказа
export interface OrderFailedEvent {
  type: Events.ORDER_FAILED;
  payload: {
    errorMessage: string; // Сообщение об ошибке
  };
}
*/
/*..................................................ДРУГИЕ ИНТЕРФЕЙСЫ...................................................*/
/*
// Интерфейс для товара
export interface Product {
  id: string;            // Уникальный идентификатор товара
  title: string;          // Название товара
  category: string;   // Категория товара
  description: string;   // Описание товара
  price: number | null;         // Цена товара
  image: string;      // URL изображения товара
}

// Интерфейс формы состояния (для поля ввода)
export interface FormFieldState {
  value: string;          // Значение поля
  isValid: boolean;       // Валидация поля
  errorMessage?: string;  // Сообщение об ошибке (если есть)
}

// Интерфейс состояния приложения
export interface AppState {
  products: Product[];            // Список всех товаров
  basket: BasketState;            // Состояние корзины
  modalState: ModalState;         // Состояние модальных окон
  orderState?: OrderFormState;    // Состояние текущего оформления заказа (если начато)
}

// Интерфейс формы заказа
export interface OrderFormState {
  products: {
    title: string;       // Название товара
    price: number  | null;       // Цена товара
  }
  paymentType: 'online' | 'onDelivery'; // Выбранный тип оплаты
  address: FormFieldState;   // Поле для адреса доставки
  email: FormFieldState;     // Поле для электронной почты
  phone: FormFieldState;     // Поле для номера телефона
}

// Интерфейс состояния корзины
export interface BasketState {
  items: {
    title: string;       // Название товара
    price: number | null;       // Цена товара
  }[];
  totalItems: number;        // Общее количество товаров
  totalPrice: number;        // Общая стоимость товаров
}

// Интерфейс состояния модального окна
export interface ModalState {
  isOpen: boolean;           // Флаг, открыто ли окно
  modalType?: string;        // Тип текущего модального окна (например, "basket" или "product")
}

// Интерфейс базового компонента
export interface BaseComponent {
  render(): void;            // Метод рендеринга компонента
  attachEventListeners(): void; // Метод для привязки обработчиков событий
}
*/