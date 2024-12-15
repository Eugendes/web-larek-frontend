import { IGoods, mapCategoryToClass } from '../../types/types';
import { getCardElements } from '../getElements';
import { CDN_URL } from '../../utils/constants';
import { ModalManager } from './ModalManager';
import { GoodsController } from '../controllers/GoodsController';
import { addToBasket } from '../controllers/Basket';

export class GoodsView {
  private gallery: HTMLElement | null;
  private goodsController: GoodsController;

  constructor(goodsController: GoodsController) {
    this.gallery = document.querySelector('main.gallery');
    this.goodsController = goodsController;
  }

  renderProducts(products: IGoods[]): void {
    if (!this.gallery) {
      console.error('Не найден контейнер для галереи');
      return;
    }

    const template = document.getElementById('card-catalog') as HTMLTemplateElement;
    if (!template) {
      console.error('Не найден шаблон card-catalog');
      return;
    }

    products.forEach((product) => {
      const card = template.content.cloneNode(true) as HTMLElement;
      const { categoryElement, titleElement, imageElement, priceElement } = getCardElements(card);

      if (categoryElement) {
        categoryElement.classList.add(mapCategoryToClass(product.category));
        categoryElement.textContent = product.category;
      }

      if (titleElement) {
        titleElement.textContent = product.title;
      }

      if (imageElement && product.image) {
        imageElement.src = `${CDN_URL}/${product.image}`;
        imageElement.alt = product.title;
      }

      if (priceElement) {
        const formattedPrice = product.price?.toLocaleString('ru-RU');
        priceElement.textContent = formattedPrice ? `${formattedPrice} синапсов` : 'Бесценно';
      }

      const cardButton = card.querySelector('.card') as HTMLElement;
      cardButton.setAttribute('data-product-id', product.id);

      this.gallery.appendChild(card);
    });

    this.addCardClickListener();
  }

  private async openProductPreview(productDetails: IGoods): Promise<void> {
    const template = document.getElementById('card-preview') as HTMLTemplateElement;
  
    if (!template) {
      console.error('Шаблон card-preview не найден');
      return;
    }
  
    const modalContent = template.content.cloneNode(true) as HTMLElement;
  
    const { categoryElement, titleElement, textElement, imageElement, priceElement } =
      getCardElements(modalContent);
  
    if (categoryElement) {
      categoryElement.textContent = productDetails.category;
      categoryElement.classList.add(mapCategoryToClass(productDetails.category));
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
      const formattedPrice = productDetails.price?.toLocaleString('ru-RU') ?? null;
      priceElement.textContent = formattedPrice ? `${formattedPrice} синапсов` : 'Бесценно';
    }
  
    const addToCartButton = modalContent.querySelector('.card__button') as HTMLButtonElement;
  
    if (!addToCartButton) {
      console.error('Кнопка "Добавить в корзину" не найдена в модальном окне:', modalContent.innerHTML);
      return;
    }
  
    addToCartButton.addEventListener('click', () => {
      addToBasket({
        id: productDetails.id,
        title: productDetails.title,
        price: productDetails.price,
      });
      modalManager.closeModal();
    });
  
    const modalManager = new ModalManager(document.getElementById('modal-container') as HTMLElement);
    modalManager.openModal(modalContent);
  }

  private addCardClickListener(): void {
    if (!this.gallery) return;

    this.gallery.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const card = target.closest('.card') as HTMLElement;

      if (card) {
        const productId = card.getAttribute('data-product-id');

        if (productId) {
          const productDetails = await this.goodsController.getProductById(productId);
          if (productDetails) {
            await this.openProductPreview(productDetails);
          }
        }
      }
    });
  }
}
