export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
  };
  
  export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
  
  export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;
  
    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }
  
    // Обновленный метод handleResponse с типизацией
    protected handleResponse<Type>(response: Response): Promise<ApiListResponse<Type>> {
        if (response.ok) {
            return response.json();
        } else {
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText));
        }
    }
  
    // Обновленный метод get с типизацией возвращаемого значения
    get<Type>(uri: string): Promise<ApiListResponse<Type>> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(response => this.handleResponse<Type>(response));
    }
  
    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
  }
  