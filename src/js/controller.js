import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
// 	module.hot.accept();
// }

const controlRecipes = async function () {
	try {
		const recipeId = window.location.hash.slice(1);
		// const recipeId = '5ed6604591c37cdc054bc886';
		// const recipeId = 'nonono';
		if (!recipeId) return;

		// atualizar a view de resultados para marcar o resultado selecionado
		resultsView.update(model.getSearchResultsPage());

		recipeView.renderSpinner();

		await model.loadRecipe(recipeId);

		// if (!model.state.recipe) return;
		recipeView.render(model.state.recipe);
		// recipeView.update(model.state.recipe);
	} catch (err) {
		console.log(err);
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();

		const query = searchView.getQuery();
		if (!query) return;

		await model.loadSearchResults(query);
		searchView.clearInput();

		// const results = model.state.search.results;

		resultsView.render(model.getSearchResultsPage());
		paginationView.render(model.state.search);
	} catch (err) {
		console.log(err);
	}
};

const controlPagination = function (page) {
	resultsView.render(model.getSearchResultsPage(page));
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	if (newServings < 1) return;
	console.log(model.state.recipe);
	model.updateServings(newServings);
	recipeView.update(model.state.recipe);
};

const init = function () {
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
};
init();
