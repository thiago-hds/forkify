import icons from 'url:../../img/icons.svg';
export default class View {
	_data;

	/**
	 * Render the received object
	 * @param {Object | Object[]} data The data to be rendered
	 * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
	 * @returns {undefined | string} A markup is returned if render=false
	 * @this {Object} View instance
	 */
	render(data, render = true) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();

		this._data = data;
		const markup = this._generateMarkup();

		if (!render) return markup;
		this._parentElement.innerHTML = markup;
	}

	update(data) {
		this._data = data;

		const newMarkup = this._generateMarkup();

		// converte a string html para um elemento DOM
		const newDom = document
			.createRange()
			.createContextualFragment(newMarkup);

		const newElements = Array.from(newDom.querySelectorAll('*'));
		const currentElements = Array.from(
			this._parentElement.querySelectorAll('*')
		);

		// percorrer todos os elementos do DOM atual e do novo e verificar
		// quais são diferentes e precisam ser atualizados.
		newElements.forEach((newElement, i) => {
			const currentElement = currentElements[i];

			// se o novo elemento for diferente do atual e se contém texto
			// ele deve ser atualizado.
			if (
				!newElement.isEqualNode(currentElement) &&
				newElement.firstChild?.nodeValue.trim() !== ''
			) {
				currentElement.textContent = newElement.textContent;
			}

			// se o novo elemento for diferente do atual, atualizar atributos do elemento
			// atual
			if (!newElement.isEqualNode(currentElement)) {
				Array.from(newElement.attributes).forEach(attr => {
					currentElement.setAttribute(attr.name, attr.value);
				});
			}
		});
	}

	renderSpinner() {
		const html = `
            <div class="spinner">
                <svg>
                <use href="${icons}#icon-loader"></use>
                </svg>
            </div>`;

		this._parentElement.innerHTML = html;
	}

	renderError(message = this._errorMessage) {
		const html = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div> 
        `;

		this._parentElement.innerHTML = html;
	}

	renderMessage(message = this._message) {
		const html = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div> 
        `;

		this._parentElement.innerHTML = html;
	}
}
