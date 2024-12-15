
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

export interface BasketItems {
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

// Интерфейс для ответов API с пагинацией
export interface ApiListResponses<Type> {
  total: number;
  items: Type[];
}
