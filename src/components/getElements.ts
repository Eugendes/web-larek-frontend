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
