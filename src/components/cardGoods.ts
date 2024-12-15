import { Api } from './base/api';
import { IGoods, mapCategoryToClass } from '../types/types';
import { API_URL, CDN_URL } from '../utils/constants';
import { ModalManager } from './ModalManager';
import { getCardElements } from './getElements';
import { addToBasket } from './Basket';

export class GoodsService {
  private api: Api;
  private cdnUrl: string;
  private goodsList: IGoods[] = [];

  constructor(apiUrl: string, cdnUrl: string) {
    this.api = new Api(apiUrl);
    this.cdnUrl = cdnUrl;
  }

  // Fetch products from the server
  async fetchProducts(): Promise<IGoods[]> {
    try {
      const response = await this.api.get<IGoods>('/product/');
      this.goodsList = response.items;
      return this.goodsList;
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      return [];
    }
  }

  // Get product by ID
  getProductById(id: string): IGoods | undefined {
    const product = this.goodsList.find((product) => product.id === id);
    if (!product) {
      console.warn(`Товар с id "${id}" не найден`);
    }
    return product;
  }

  // Render products on the page
  renderProducts(products: IGoods[]): void {
    const gallery = document.querySelector('main.gallery');
    if (!gallery) {
      console.error('Не найден контейнер для галереи');
      return;
    }

    const template = document.getElementById(
      'card-catalog'
    ) as HTMLTemplateElement;
    if (!template) {
      console.error('Не найден шаблон card-catalog');
      return;
    }

    products.forEach((product) => {
      const card = template.content.cloneNode(true) as HTMLElement;
      const { categoryElement, titleElement, imageElement, priceElement } =
        getCardElements(card);

      if (categoryElement) {
        categoryElement.classList.add(mapCategoryToClass(product.category));
        categoryElement.textContent = product.category;
      }

      if (titleElement) {
        titleElement.textContent = product.title;
      }

      if (imageElement && product.image) {
        imageElement.src = `${this.cdnUrl}/${product.image}`;
        imageElement.alt = product.title;
      }

      if (priceElement) {
        const formattedPrice = product.price?.toLocaleString('ru-RU');
        const priceText =
          product.price !== null ? `${formattedPrice} синапсов` : 'Бесценно';
        priceElement.textContent = priceText;
      }

      const cardButton = card.querySelector('.card') as HTMLElement;
      cardButton.setAttribute('data-product-id', product.id);

      gallery.appendChild(card);
    });

    if (gallery) {
      gallery.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const card = target.closest('.card') as HTMLElement;
        if (card) {
          const productId = card.getAttribute('data-product-id');
          if (productId) {
            openProductPreview(productId);
          }
        }
      });
    }
  }
}

async function openProductPreview(productId: string) {
  try {
    const productDetails = await goodsService.getProductById(productId);

    if (!productDetails) return;

    const template = document.getElementById(
      'card-preview'
    ) as HTMLTemplateElement;
    if (!template) {
      console.error('Не найден шаблон card-preview');
      return;
    }

    const modalContent = template.content.cloneNode(true) as HTMLElement;
    const {
      categoryElement,
      titleElement,
      textElement,
      imageElement,
      priceElement,
    } = getCardElements(modalContent);

    if (categoryElement) {
      categoryElement.textContent = productDetails.category;
      categoryElement.classList.add(
        mapCategoryToClass(productDetails.category)
      );
    }
    if (titleElement) {
      titleElement.textContent = productDetails.title;
    }
    if (textElement) {
      textElement.textContent = productDetails.description;
    }
    if (imageElement && productDetails.image) {
      imageElement.src = `${CDN_URL}/${productDetails.image}`;
      imageElement.alt = productDetails.title;
    }
    if (priceElement) {
      const formattedPrice =
        productDetails.price?.toLocaleString('ru-RU') ?? null;
      priceElement.textContent =
        formattedPrice !== null
          ? `${formattedPrice} синапсов`
          : 'Бесценно';
    }

    const addToCartButton = modalContent.querySelector(
      '.button'
    ) as HTMLButtonElement;

    if (addToCartButton) {
      addToCartButton.addEventListener('click', () => {
        addToBasket({
          id: productDetails.id,
          title: productDetails.title,
          price: productDetails.price,
        });
      });
    }

    const modalManager = new ModalManager(document.getElementById('modal-container') as HTMLElement);
    modalManager.openModal(modalContent);    
  } catch (error) {
    console.error('Ошибка при загрузке данных о товаре:', error);
  }
}

export const goodsService = new GoodsService(API_URL, CDN_URL);
