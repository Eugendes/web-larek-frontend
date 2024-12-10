# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

### Паттерн проектирования
В данном проекте используется паттерн **MVC** (Model-View-Controller).

-**Model**: отвечает за управление данными приложения, например, классы GoodsManager, BasketManager, и PaymentManager.
-**View**: отвечает за отображение данных и пользовательский интерфейс, например, классы GoodsCard, Modal, и Basket.
-**Controller**: координирует взаимодействие между Model и View. В проекте эту роль выполняют классы App и AppController, которые управляют переходами, обработкой событий и взаимодействием между данными и интерфейсом.

Паттерн MVC обеспечивает модульность и удобство масштабирования проекта, а также разделяет ответственность между слоями, что упрощает тестирование и поддержку кода.


## Архитектура, базовые классы

1. Class GoodsCard
Представляет карточку товара. Отвечает за отображение карточек на главной странице и обработку кликов по ним. Создает карточку на основе переданных данных. Управляет обработчиками событий. 
Поля:
-goods: Goods: объект товара, передаваемый в карточку.
-element: HTMLElement: HTML-элемент карточки.
Методы, используемые в классе:
-constructor(goods: Goods): конструктор принимает объект товара.
-renderCard(): инициализирует HTML-разметку карточки.
Так же в этом классее мы устанавливаем обработчики событий на каждую карточку (клик для открытия модального окна).

2. Class Modal
Это базовый класс для всех модальных окон (информация о товаре, корзина, оплата и т. д.). Он отвечает за рендеринг модальных окон и их закрытие. 
Поля:
-title: string: заголовок модального окна.
-content: HTMLElement: контент модального окна.
-modalElement: HTMLElement: HTML-элемент, представляющий модальное окно.
-overlay: HTMLElement: HTML-элемент для затемнения фона при открытом модальном окне.
-isOpen: boolean: флаг, указывающий, открыто ли окно.
Методы, используемые в классе:
-constructor(title: string, content: HTMLElement): принимает заголовок модального окна и заполняемые данные.
-renderModal(): инициализирует HTML-разметку модального окна.
-addToBasket(goods: Goods): добавляет товар в корзину.
-openModal(): открывает окно.
-closeModal(): закрывает окно.
Устанавливаем обработчики событий для управления окном(закрытие, открытие следующих).

3. Class Basket
Он управляет корзиной товаров. Отвечает за добавление, удаление товаров и подсчет общей стоимости. 
Поля:
-basketGoods: Goods[]: массив объектов товаров, добавленных в корзину.
-totalPrice: number: общая стоимость всех товаров в корзине.
-basketElement: HTMLElement: HTML-элемент для отображения корзины на странице.
-eventListeners: { [key: string]: EventListener }: объект, содержащий обработчики событий для элементов корзины.
Методы, используемые в классе:
-constructor(): инициализирует корзину (массив товаров и общую сумму).
-removeFromBasket(goodsId: string): удаляет товар из корзины.
-calculateTotalPrice(): подсчитывает общую стоимость.
-renderBasket(): рендерит HTML список корзины.

4. Class PurchasingProcess
Управляет процессом оформления заказа. Обрабатывает действия пользователя при переходе между этапами оплаты.
Поля:
-basket: Basket: объект корзины, содержащий товары пользователя.
-currentStep: number: текущий шаг процесса оформления заказа.
-paymentData: Payment: данные, введенные пользователем в процессе оплаты.
-stepElements: HTMLElement[]: массив HTML-элементов, представляющих шаги оформления заказа.
-processContainer: HTMLElement: контейнер, в котором отображается процесс оформления заказа.
Методы, используемые в классе:
-constructor(basket: Basket): Инициализирует процесс на основе текущей корзины.
-savePaymentDetails(paymentData: { payment: string; address: string }): сохраняет данные об оплате и адресе.
-saveContactDetails(contactData: { email: string; phone: string }): сохраняет данные юзера.
-renderStep(step: number): Рендерит нужный этап оформления заказа.

5. Class App
Это основной класс приложения, который объединяет остальные модули. Управляет инициализацией проекта и взаимодействием компонентов. 
Поля:
-goodsManager: GoodsManager: объект для управления товарами.
-basketManager: BasketManager: объект для управления корзиной.
-modalManager: ModalManager: объект для управления модальными окнами.
-stateManager: StateManager: объект для управления состоянием приложения.
-rootElement: HTMLElement: корневой HTML-элемент приложения.
-currentRoute: string: текущий маршрут приложения (например, "главная", "корзина").
Методы, используемые в классе:
-constructor(): Инициализирует классы корзины, карточек, модальных окон и тд.
-init(): Запускает приложение (рендеринг карточек, настройка обработчиков).
-handleRouteChange(): Обрабатывает переходы между разделами (корзиной и главным окном).

6. StateManager
Этот класс будет управлять состоянием данных на странице: корзиной, доступными товарами, и информацией, введённой в процессе оформления заказа.
Поля:
-availableGoods: Goods[]: массив всех доступных товаров.
-basket: Basket`: текущая корзина пользователя, содержащая выбранные товары и общую стоимость.
-paymentData: Partial<Payment>: данные, введенные пользователем в процессе оплаты (адрес, тип оплаты и т. д.).
-savedState: PurchasingProcess: сохраненное состояние приложения, используемое для восстановления.
-listeners: { [key: string]: () => void }: объект для подписки на события изменения состояния.
Методы, используемые в классе:
constructor(allGoods: Goods[]): Инициализирует список доступных товаров, пустую корзину и пустые данные оформления.
resetPaymentData(): Сбрасывает данные оформления заказа.
setPaymentData(data: Partial<Payment>): Сохраняет или обновляет частичные данные оформления.
getPaymentData(): Partial<Payment> Возвращает текущие данные оформления заказа.
getBasket(): Basket: Возвращает текущую корзину пользователя, включая товары и стоимость.

## Компоненты модели данных

1. Класс GoodsManager
Управляет доступными товарами и взаимодействием с корзиной.
-Сохраняет и обновляет список всех доступных товаров.
-Позволяет добавлять товар в корзину или возвращать его в список доступных.
-Обновляет отображение товаров на главной странице.
-Ключевые методы:
    addToBasket(goods: Goods): добавляет товар в корзину.
    removeFromBasket(goodsId: string): возвращает товар обратно в список доступных.
    getAvailableGoods(): возвращает товары, которые ещё не были добавлены в корзину.

2. Класс BasketManager
Управляет состоянием корзины пользователя, включая товары и общую стоимость.
-Позволяет добавлять, удалять товары и рассчитывать итоговую стоимость.
-Ключевые методы:
    getBasket(): возвращает текущее состояние корзины.
    addToBasket(goods: Goods): добавляет товар в корзину и обновляет стоимость.
    removeFromBasket(goodsId: string): удаляет товар из корзины и пересчитывает стоимость.
    getTotalPrice(): возвращает общую стоимость товаров в корзине.

3. Класс ModalManager
Управляет отображением и состоянием модальных окон.
-Открывает модальные окна с деталями товара, корзиной или процессом оформления.
-Сохраняет состояние открытых окон.
-Ключевые методы:
    openModal(type: string, data?: any): открывает указанное модальное окно с данными.
    closeModal(): закрывает текущее окно.
    isOpen(): проверяет, открыто ли модальное окно.

4. Класс PaymentManager
Управляет процессом оформления заказа.
-Позволяет сохранять введённые данные и передавать их между шагами.
-Обрабатывает выбор типа оплаты и ввод контактных данных.
-Ключевые методы:
    setPaymentData(data: Partial<Payment>): сохраняет или обновляет данные оформления.
    getPaymentData(): возвращает текущие данные оформления.
    resetPaymentData(): сбрасывает все введённые данные.

5. Класс AppController
Координирует работу всех остальных классов.
-Обеспечивает интеграцию товаров, корзины и модальных окон.
-Запускает приложение и обрабатывает переходы между разделами.
-Ключевые методы:
    init(): инициализирует приложение, настраивает события и рендерит товары.
    handleAddToBasket(goodsId: string): обрабатывает добавление товара в корзину.
    handleRouteChange(): управляет переходами между разделами, например, из корзины на оформление заказа.

6. Класс StateManager
Хранит и управляет текущим состоянием приложения.
-Позволяет сохранять данные при переходах и сбрасывать их по запросу.
-Ключевые методы:
    saveState(state: PurchasingProcess): сохраняет текущее состояние приложения.
    restoreState(): возвращает сохранённое состояние.
    resetState(): сбрасывает всё состояние приложения.

## Ключевые интерфейсы и соответствующие им типы данных

1. Goods: Интерфейс для представления главной страницы сайта и отображения всех необходимых данных в карточках.

```
export interface Goods {
  id: string; //id товара
  category: string; //категория товара
  title: string; //название товара
  image: string; //картинка товара
  price: number; //цена
}
```

2. GoodSelect: Интерфейс для представления модального окна и отображения всех необходимых данных на выбранной карточке.

```
export interface GoodSelect {
  id: string; //id товара
  category: string; //категория товара
  title: string; //название товара
  image: string; //картинка товара
  description: string; //описание товара
  price: number; //цена
}
```


3. Basket: Интерфейс отвечающий за отображение корзины с товарами, краткой информацией и них и стоимость, включая общую.

```
export interface Basket {
  basketGoods: Goods[]; //выбранные товары(массив данных)
  priceTotal: number; //общая цена товаров 
}
```

4. Payment: Интерфейс отвечает за прохождение пути оплаты и отображения всех необходимых данных, ключая итоговую стоимость 
отображаемую на последнем шаге

```
export interface Payment {
  basket: Basket; //выбранные товары(используется только массив price[]) 
  payment: string; //тип оплаты
  address: string; //адрес доставки
  email: string; //почта получателя
  phone: string; //номер получателя
}
```

5. PurchasingProcess: Интерфейс сохранения действий пользователя на сайте, и отображение актуальной информации на странице.

```
export interface PurchasingProcess {
  basketGoods: Goods[]; //доступные товары(массив данных)
  basket: Basket; //выбранные товары
}
```

## Размещение в сети
Рабочая версия сайта доступна по адресу: https://eugendes.github.io/web-larek-frontend/