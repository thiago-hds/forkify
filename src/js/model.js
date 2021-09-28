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
};

export const loadRecipe = async function (recipeId) {
	try {
		const json = await getJson(`${API_URL}${recipeId}`);
		// console.log(json);
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
