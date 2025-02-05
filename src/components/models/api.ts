import { ApiListResponses } from '../../types/types';

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {}),
            },
        };
    }

    protected handleResponse<Type>(response: Response): Promise<Type> {
        if (response.ok) {
            return response.json();
        } else {
            return response.json()
                .then(data => Promise.reject(data.error ?? response.statusText));
        }
    }

    get<Type>(uri: string): Promise<ApiListResponses<Type>> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET',
        }).then(response => this.handleResponse<ApiListResponses<Type>>(response));
    }

    post<Type>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<Type> {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data),
        }).then(response => this.handleResponse<Type>(response));
    }
}
