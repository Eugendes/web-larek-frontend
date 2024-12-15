import { GoodsService } from '../base/GoodsService';
import { GoodsView } from '../views/GoodsView';
import { API_URL } from '../../utils/constants';
import { IGoods } from '../../types/types';

export class GoodsController {
  private goodsService: GoodsService;
  private goodsView: GoodsView;

  constructor() {
    // Инициализация сервиса и представления
    this.goodsService = new GoodsService(API_URL);
    this.goodsView = new GoodsView(this); // Передаем `GoodsController` в `GoodsView`
  }

  // Загружаем и отображаем товары
  async loadAndRenderProducts(): Promise<void> {
    try {
      const products = await this.goodsService.fetchProducts();
      this.goodsView.renderProducts(products);
    } catch (error) {
      console.error('Ошибка загрузки и отображения товаров:', error);
    }
  }

  // Получаем товар по ID
  async getProductById(id: string): Promise<IGoods | null> {
    try {
      const product = this.goodsService.getProductById(id);
      if (product) {
        return product;
      } else {
        console.warn(`Товар с ID ${id} не найден`);
        return null;
      }
    } catch (error) {
      console.error('Ошибка получения товара по ID:', error);
      return null;
    }
  }
}
