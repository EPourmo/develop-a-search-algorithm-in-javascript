import recipes from "./data/recipes.js";
import RecipeCard from "./templates/RecipeCard.js";
import Filters from "./utils/filters.js";
import FilterSearchBar from "./utils/FilterSearchBar.js";

const recipesArray = recipes;
const recipeWrapper = document.querySelector(".recipes-wrapper");
const serachBarInput = document.querySelector(".search_nav-input");

// function to display card
const getRecipesCard = (recipes) => {
  recipes.forEach((recipe) => {
    const Template = new RecipeCard(recipe);
    recipeWrapper.appendChild(Template.createRecipeCard());
  });
};

// function to generate unique Filters list
const getFilters = (recipes) => {
  let uniqueIngredients = [];
  let uniqueApplicances = [];
  let uniqueUtensils = [];
  recipes.forEach((recipe) => {
    uniqueIngredients = [
      ...new Set(
        [
          ...uniqueIngredients,
          new Filters(recipe).displayIngredientsList(),
        ].flat()
      ),
    ];
    uniqueApplicances = [
      ...new Set([...uniqueApplicances, recipe.appliance.toLowerCase()]),
    ];

    uniqueUtensils = [
      ...new Set(
        [...uniqueUtensils, new Filters(recipe).displayUtensilsList()].flat()
      ),
    ];
  });

  return { uniqueIngredients, uniqueApplicances, uniqueUtensils };
};

// Event Listener on filter buttons / menu
const ingredientBtn = document.querySelector(".filter-btn.blue-clr");
const ingredientForm = document.querySelector(".ingredients-form-container");
const angleUpCloseIngredient = document.querySelector(
  ".ingredients-form .fa-solid.fa-angle-up"
);
const ingredientsMenu = document.querySelector(".ingredients-menu");
const applianceBtn = document.querySelector(".filter-btn.green-clr");
const applianceForm = document.querySelector(".appliances-form-container");
const angleUpCloseAppliance = document.querySelector(
  ".appliances-form .fa-solid.fa-angle-up"
);
const appliancesMenu = document.querySelector(".appliances-menu");
const utensilBtn = document.querySelector(".filter-btn.red-clr");
const utensilForm = document.querySelector(".utensils-form-container");
const angleUpCloseUtensils = document.querySelector(
  ".utensils-form .fa-solid.fa-angle-up"
);
const utensilsMenu = document.querySelector(".utensils-menu");

const eventListenerFiltersMenu = (btn, form, icon) => {
  btn.addEventListener("click", () => {
    btn.classList.add("remove");
    form.classList.remove("remove");
  });

  icon.addEventListener("click", () => {
    btn.classList.remove("remove");
    form.classList.add("remove");
  });
};

eventListenerFiltersMenu(ingredientBtn, ingredientForm, angleUpCloseIngredient);
eventListenerFiltersMenu(applianceBtn, applianceForm, angleUpCloseAppliance);
eventListenerFiltersMenu(utensilBtn, utensilForm, angleUpCloseUtensils);

// function to generate menu from filters
const createFilterList = (array, appendElement) => {
  array.forEach((item) => {
    const listElement = document.createElement("li");
    listElement.setAttribute("class", "list-element");
    listElement.textContent = item;
    appendElement.appendChild(listElement);
  });
};

// generate recipes card and menu lists from input (array)
const generatePage = (recipes) => {
  getRecipesCard(recipes);
  const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
    getFilters(recipes);
  createFilterList(uniqueIngredients, ingredientsMenu);
  createFilterList(uniqueApplicances, appliancesMenu);
  createFilterList(uniqueUtensils, utensilsMenu);
};

const init = () => {
  generatePage(recipesArray);

  serachBarInput.addEventListener("input", (e) => {
    recipeWrapper.innerHTML = "";
    ingredientsMenu.innerHTML = "";
    appliancesMenu.innerHTML = "";
    utensilsMenu.innerHTML = "";
    const inputValue = e.target.value.toLowerCase();
    let filteredDataSB = new FilterSearchBar(
      recipesArray,
      inputValue
    ).mainFilterRecipes();
    generatePage(filteredDataSB);
  });
};

init();
