import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { sendRequest } from './helpers';

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

const createRecipeObject = function (data) {
	return {
		id: data.id,
		title: data.title,
		publisher: data.publisher,
		sourceUrl: data.source_url,
		image: data.image_url,
		servings: data.servings,
		cookingTime: data.cooking_time,
		ingredients: data.ingredients,
		key: data.key ?? null,
	};
};

export const loadRecipe = async function (recipeId) {
	try {
		const json = await sendRequest(`${API_URL}${recipeId}?key=${API_KEY}`);
		const { recipe } = json.data;

		state.recipe = createRecipeObject(recipe);

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

		const json = await sendRequest(
			`${API_URL}?key=${API_KEY}&search=${query}`
		);
		let { recipes } = json.data;
		recipes = recipes.map(recipe => {
			return {
				id: recipe.id,
				title: recipe.title,
				publisher: recipe.publisher,
				image: recipe.image_url,
				key: recipe.key ?? null,
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

export const uploadRecipe = async function (newRecipe) {
	console.log(Object.entries(newRecipe));

	const isValidIngredient = entry =>
		entry[0].startsWith('ingredient-') && entry[1] !== '';

	const convertIngredientToObject = ingredient => {
		const ingredientDetails = ingredient[1].split(',').map(el => el.trim());
		console.log(ingredientDetails);
		if (ingredientDetails.length !== 3)
			throw new Error(
				'Wrong ingredient format. Please use the correct format.'
			);

		const [quantity, unit, description] = ingredientDetails;
		return {
			quantity: quantity ? +quantity : null,
			unit,
			description,
		};
	};

	const ingredients = Object.entries(newRecipe)
		.filter(isValidIngredient)
		.map(convertIngredientToObject);
	console.log(ingredients);

	const recipeData = {
		title: newRecipe.title,
		source_url: newRecipe.sourceUrl,
		image_url: newRecipe.image,
		publisher: newRecipe.publisher,
		cooking_time: +newRecipe.cookingTime,
		servings: +newRecipe.servings,
		ingredients,
	};

	const json = await sendRequest(`${API_URL}?key=${API_KEY}`, recipeData);

	const { recipe } = json.data;
	state.recipe = createRecipeObject(recipe);
	addBookmark(state.recipe);
};

const init = function () {
	restoreBookmarks();
};
init();
