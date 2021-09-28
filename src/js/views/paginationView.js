import View from './view.js';

import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
	_parentElement = document.querySelector('.pagination');

	addHandlerClick(handler) {
		this._parentElement.addEventListener('click', function (e) {
			const button = e.target.closest('.btn--inline');
			if (!button) return;

			const goToPage = button.dataset.goto;
			handler(Number(goToPage));
		});
	}

	_generateMarkup() {
		const currentPage = this._data.page;
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);
		console.log('number of pages', numPages);

		let markup = '';

		if (currentPage > 1) {
			markup += this._generatePreviousPageButtonMarkup();
		}

		if (currentPage < numPages) {
			markup += this._generateNextPageButtonMarkup();
		}

		return markup;
	}

	_generatePreviousPageButtonMarkup() {
		const previousPage = this._data.page - 1;
		return `
            <button data-goto="${previousPage}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${previousPage}</span>
            </button>
            `;
	}

	_generateNextPageButtonMarkup() {
		const nextPage = this._data.page + 1;
		return `
            <button data-goto="${nextPage}" class="btn--inline pagination__btn--next">
                <span>Page ${nextPage}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
	}
}
export default new PaginationView();
