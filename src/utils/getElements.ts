export function getCardElements(container: HTMLElement) {
  return {
    categoryElement: container.querySelector('.card__category') as HTMLElement,
    titleElement: container.querySelector('.card__title') as HTMLElement,
    imageElement: container.querySelector('.card__image') as HTMLImageElement,
    priceElement: container.querySelector('.card__price') as HTMLElement,
    textElement: container.querySelector('.card__text') as HTMLElement,
    buttonElement: container.querySelector('.card__button') as HTMLButtonElement
  };
}

export function listPreparatory(): HTMLDivElement {
  // Создаем контейнер корзины
  const basketContainer = document.createElement('div');
  basketContainer.classList.add('basket');

  const basketTitle = document.createElement('h2');
  basketTitle.classList.add('modal__title');
  basketTitle.textContent = 'Корзина';

  const basketList = document.createElement('ul');
  basketList.classList.add('basket__list');

  const basketActions = document.createElement('div');
  basketActions.classList.add('modal__actions');

  const checkoutButton = document.createElement('button');
  checkoutButton.classList.add('button');
  checkoutButton.textContent = 'Оформить';

  const basketPrice = document.createElement('span');
  basketPrice.classList.add('basket__price');
  basketPrice.textContent = '0 синапсов'; // Пока статическое значение

  // Добавляем созданные элементы в контейнер
  basketContainer.appendChild(basketTitle);
  basketContainer.appendChild(basketList);
  basketActions.appendChild(checkoutButton);
  basketActions.appendChild(basketPrice);
  basketContainer.appendChild(basketActions);

  return basketContainer;
}
