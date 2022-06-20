import recipes from "./data/recipes.js";
import RecipeCard from "./templates/RecipeCard.js";
import Filters from "./utils/Filters.js";
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

let filteredDataSB;
let currentRecipesData = recipesArray;
let removedIngredients = [];

// function to generate menu from filters
const createFilterList = (array, appendElement, name) => {
  array.forEach((item) => {
    const listElement = document.createElement("li");
    listElement.setAttribute("class", `list-element ${name}`);
    listElement.textContent = item;
    appendElement.appendChild(listElement);
  });
};

const createIngredientList = (array, appendElement, name) => {
  ingredientsMenu.innerHTML = "";
  // create ingredients list item
  array.forEach((item) => {
    const ingredient = document.createElement("li");
    ingredient.setAttribute("class", `list-element ${name}`);
    ingredient.textContent = item;
    appendElement.appendChild(ingredient);
    // event listener from each ingredient
    ingredient.addEventListener("click", () => {
      // get selected inner HTML ingredient from list
      let tagValue = ingredient.innerHTML.toLocaleLowerCase();
      removedIngredients.push(tagValue);
      // create tag
      const tag = new Tags(tagValue, "ingredient");
      const htmlTag = tag.createTag();
      tagContainer.appendChild(htmlTag);
      // function to remove tag
      removeTag(htmlTag);
      // create new recipes array data filtered
      let newData;
      removedIngredients.forEach((element) => {
        newData = currentRecipesData.filter((recipe) => {
          return recipe.ingredients.some((ingre) =>
            ingre.ingredient.toLowerCase().includes(element)
          );
        });
      });
      // create page elements
      removePage();
      // generate single ingredient array
      getRecipesCard(newData);
      const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
        getFilters(newData);
      // remove tags from ingredient list
      let removeIngredientFromList = uniqueIngredients.filter(
        (element) => !removedIngredients.includes(element)
      );
      // create ingredient menu list
      createIngredientList(
        removeIngredientFromList,
        ingredientsMenu,
        "ingredient-item"
      );
      // assign new recipes array (filtered)
      currentRecipesData = newData;
      // remove input value
      searchIngredientsInput.value = "";
      // close menu list
      ingredientBtn.classList.remove("remove");
      ingredientForm.classList.add("remove");
    });
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
  createIngredientList(uniqueIngredients, ingredientsMenu, "ingredient-item");
  createFilterList(uniqueApplicances, appliancesMenu, "appliance-item");
  createFilterList(uniqueUtensils, utensilsMenu, "utensil-item");
};

const removeTag = (tag) => {
  tag.querySelector("i").addEventListener("click", () => {
    let putBackIngredients = removedIngredients.filter(
      (item) => !tag.querySelector("p").innerHTML.includes(item)
    );
    tag.remove();
    removedIngredients = putBackIngredients;
    let newArrayData;

    filteredDataSB
      ? (newArrayData = filteredDataSB)
      : (newArrayData = recipesArray);

    if (removedIngredients.length > 0) {
      removedIngredients.forEach((element) => {
        newArrayData = newArrayData.filter((recipe) => {
          return recipe.ingredients.some((ingre) =>
            ingre.ingredient.toLowerCase().includes(element)
          );
        });
      });
    } else {
      filteredDataSB
        ? (newArrayData = filteredDataSB)
        : (newArrayData = recipesArray);
    }
    // create page elements
    removePage();
    // generate single ingredient array
    getRecipesCard(newArrayData);

    const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
      getFilters(newArrayData);
    // remove tags from ingredient list
    let removeIngredientFromList = uniqueIngredients.filter(
      (element) => !removedIngredients.includes(element)
    );
    // create ingredient menu list
    createIngredientList(
      removeIngredientFromList,
      ingredientsMenu,
      "ingredient-item"
    );
    currentRecipesData = newArrayData;
  });
};

const init = () => {
  generatePage(currentRecipesData);
  serachBarInput.addEventListener("input", (e) => {
    removePage();
    const inputValue = e.target.value.toLowerCase();
    filteredDataSB = new FilterSearchBar(
      recipesArray,
      inputValue
    ).mainFilterRecipes();
    if (filteredDataSB.length == 0) {
      recipeWrapper.innerHTML = `<p class="no-fund-message">
      Aucune recette ne correspond à votre critère… vous pouvez chercher «
      tarte aux pommes », « poisson », etc.
    </p>`;
    } else {
      generatePage(filteredDataSB);
      currentRecipesData = filteredDataSB;
    }
  });

  searchIngredientsInput.addEventListener("input", (e) => {
    let inputValue = e.target.value.toLowerCase();
    // display filtered data on ingredient search form
    const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
      getFilters(currentRecipesData);
    let filteredIngredients = uniqueIngredients.filter((ingredient) => {
      return ingredient.includes(inputValue);
    });
    if (removedIngredients.length > 0) {
      let remainIngredients = filteredIngredients.filter(
        (element) => !removedIngredients.includes(element)
      );
      ingredientsMenu.innerHTML = "";
      createIngredientList(
        remainIngredients,
        ingredientsMenu,
        "ingredient-item"
      );
    } else {
      ingredientsMenu.innerHTML = "";
      createIngredientList(
        filteredIngredients,
        ingredientsMenu,
        "ingredient-item"
      );
    }
  });
};

init();
