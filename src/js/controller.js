import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
// 	module.hot.accept();
// }

const controlRecipes = async function () {
	try {
		const recipeId = window.location.hash.slice(1);
		if (!recipeId) return;

		// atualizar as views de resultados e de bookmarks para marcar
		// a receita que está sendo exibida no momento
		resultsView.update(model.getSearchResultsPage());
		bookmarksView.update(model.state.bookmarks);

		// carregar receita
		recipeView.renderSpinner();
		await model.loadRecipe(recipeId);
		recipeView.render(model.state.recipe);
	} catch (err) {
		console.error(err);
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		// obter query
		const query = searchView.getQuery();
		searchView.clearInput();
		if (!query) return;

		// carregar resultados
		resultsView.renderSpinner();
		await model.loadSearchResults(query);

		// renderizar resultados e paginação
		resultsView.render(model.getSearchResultsPage());
		paginationView.render(model.state.search);
	} catch (err) {
		console.error(err);
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

const controlAddBookmark = function () {
	// adicionar ou remover bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// atualizar a view da receita
	recipeView.update(model.state.recipe);

	// renderizar view de bookmarks
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const init = function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
};
init();
