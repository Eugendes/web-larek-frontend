import { Api } from './api';
import { IGoods } from '../../types/types';

export class GoodsService {
  private api: Api;
  private goodsList: IGoods[] = [];

  constructor(apiUrl: string) {
    this.api = new Api(apiUrl);
  }


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

  async getProductById(id: string): Promise<IGoods | undefined> {
    return this.goodsList.find((product) => product.id === id);
  }
}
