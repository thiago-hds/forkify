import { API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJson } from './helpers';

export const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
		resultsPerPage: RESULTS_PER_PAGE,
		page: 1,
	},
	bookmarks: [],
};

export const loadRecipe = async function (recipeId) {
	try {
		const json = await getJson(`${API_URL}${recipeId}`);
		const { recipe } = json.data;

		state.recipe = {
			id: recipe.id,
			title: recipe.title,
			publisher: recipe.publisher,
			sourceUrl: recipe.source_url,
			image: recipe.image_url,
			servings: recipe.servings,
			cookingTime: recipe.cooking_time,
			ingredients: recipe.ingredients,
		};

		state.recipe.bookmarked = state.bookmarks.some(
			recipe => recipe.id === recipeId
		);
	} catch (err) {
		console.error(`🚩${err}`);
		throw err;
	}
};

export const loadSearchResults = async function (query) {
	try {
		state.search.query = query;

		const json = await getJson(`${API_URL}?search=${query}`);
		let { recipes } = json.data;
		recipes = recipes.map(recipe => {
			return {
				id: recipe.id,
				title: recipe.title,
				publisher: recipe.publisher,
				image: recipe.image_url,
			};
		});

		state.search.results = recipes;
		state.search.page = 1;
	} catch (err) {
		console.error(`🚩${err}`);
		throw err;
	}
};

export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;
	const start = (page - 1) * state.search.resultsPerPage;
	const end = page * state.search.resultsPerPage;

	return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
	state.recipe.ingredients.forEach(ing => {
		ing.quantity = ing.quantity * (newServings / state.recipe.servings);
	});
	state.recipe.servings = newServings;
};

const persistBookmarks = function () {
	localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const restoreBookmarks = function () {
	const bookmarks = localStorage.getItem('bookmarks');
	if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};

export const addBookmark = function (recipe) {
	// adicionar bookmark
	state.bookmarks.push(recipe);

	// adicionar receita atual como bookmark
	if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;

	persistBookmarks();
};

export const deleteBookmark = function (recipeId) {
	// remover receita da lista de bookmarks
	index = state.bookmarks.findIndex(recipe => recipe.id === recipeId);
	state.bookmarks.splice(index, 1);

	// desmarcar receita atual
	if (state.recipe.id === recipeId) state.recipe.bookmarked = false;

	persistBookmarks();
};

const init = function () {
	restoreBookmarks();
};
init();
