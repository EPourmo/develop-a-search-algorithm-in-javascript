import recipes from "./data/recipes.js";
import RecipeCard from "./templates/RecipeCard.js";
import Filters from "./utils/filters.js";
import FilterSearchBar from "./utils/FilterSearchBar.js";
import Tags from "./templates/Tags.js";

const recipesArray = recipes;
const recipeWrapper = document.querySelector(".recipes-wrapper");
const serachBarInput = document.querySelector(".search_nav-input");
const searchIngredientsInput = document.querySelector(
  ".search_ingredients-input"
);
const tagContainer = document.querySelector(".tag-container");

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
const createFilterList = (array, appendElement, name) => {
  array.forEach((item) => {
    const listElement = document.createElement("li");
    listElement.setAttribute("class", `list-element ${name}`);
    listElement.textContent = item;
    appendElement.appendChild(listElement);
  });
};

// function to remove recipes card and menu lists
const removePage = () => {
  recipeWrapper.innerHTML = "";
  ingredientsMenu.innerHTML = "";
  appliancesMenu.innerHTML = "";
  utensilsMenu.innerHTML = "";
};

// generate recipes card and menu lists from input (array)
const generatePage = (recipes) => {
  getRecipesCard(recipes);
  const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
    getFilters(recipes);
  createFilterList(uniqueIngredients, ingredientsMenu, "ingredient-item");
  createFilterList(uniqueApplicances, appliancesMenu, "appliance-item");
  createFilterList(uniqueUtensils, utensilsMenu, "utensil-item");
};

const init = () => {
  generatePage(recipesArray);
  let currentRecipesData = recipesArray;
  let ingredientList = document.querySelectorAll(
    ".list-element.ingredient-item"
  );

  serachBarInput.addEventListener("input", (e) => {
    removePage();
    const inputValue = e.target.value.toLowerCase();
    let filteredDataSB = new FilterSearchBar(
      currentRecipesData,
      inputValue
    ).mainFilterRecipes();
    currentRecipesData = filteredDataSB;
    generatePage(currentRecipesData);
  });

  searchIngredientsInput.addEventListener("input", (e) => {
    let inputValue = e.target.value.toLowerCase();
    const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
      getFilters(currentRecipesData);

    let filteredIngredients = uniqueIngredients.filter((ingredient) => {
      return ingredient.includes(inputValue);
    });
    ingredientsMenu.innerHTML = "";
    createFilterList(filteredIngredients, ingredientsMenu, "ingredient-item");
    let NewIngredientList = document.querySelectorAll(
      ".list-element.ingredient-item"
    );

    NewIngredientList.forEach((ingredient) => {
      ingredient.addEventListener("click", () => {
        let tagValue = ingredient.innerHTML.toLocaleLowerCase();
        const tag = new Tags(tagValue, "ingredient");
        tagContainer.appendChild(tag.createTag());

        let newData = currentRecipesData.filter((recipe) => {
          return recipe.ingredients.some((ingredient) =>
            ingredient.ingredient.toLowerCase().includes(tagValue)
          );
        });
        ingredientBtn.classList.remove("remove");
        ingredientForm.classList.add("remove");
        currentRecipesData = newData;
        removePage();

        generatePage(currentRecipesData);
      });
    });
  });

  ingredientList.forEach((ingredient) => {
    ingredient.addEventListener("click", () => {
      let tagValue = ingredient.innerHTML.toLocaleLowerCase();
      const tag = new Tags(tagValue, "ingredient");
      tagContainer.appendChild(tag.createTag());

      let newData = currentRecipesData.filter((recipe) => {
        return recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(tagValue)
        );
      });
      ingredientBtn.classList.remove("remove");
      ingredientForm.classList.add("remove");
      searchIngredientsInput.innerHTML = "";
      currentRecipesData = newData;
      removePage();

      generatePage(currentRecipesData);
    });
  });
};

init();
