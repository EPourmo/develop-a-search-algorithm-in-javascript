import recipes from "./data/recipes.js";
import RecipeCard from "./templates/RecipeCard.js";
import Filters from "./utils/Filters.js";
import FilterSearchBar from "./utils/FilterSearchBar.js";
import Tags from "./templates/Tags.js";

// ----------------- CONSTANTS -----------------
// initial recipes array
const recipesArray = recipes;
// DOM elements
const recipeWrapper = document.querySelector(".recipes-wrapper");
const serachBarInput = document.querySelector(".search_nav-input");
const searchIngredientsInput = document.querySelector(
  ".search_ingredients-input"
);
const searchAppliancesInput = document.querySelector(
  ".search_appliances-input"
);
const searchUtensilsInput = document.querySelector(".search_utensils-input");
const tagContainer = document.querySelector(".tag-container");
const ingredientBtn = document.querySelector(".filter-btn.blue-clr");
const ingredientForm = document.querySelector(".ingredients-form-container");
const ingredientsMenu = document.querySelector(".ingredients-menu");
const angleUpCloseIngredient = document.querySelector(
  ".ingredients-form .fa-solid.fa-angle-up"
);
const applianceBtn = document.querySelector(".filter-btn.green-clr");
const applianceForm = document.querySelector(".appliances-form-container");
const appliancesMenu = document.querySelector(".appliances-menu");
const angleUpCloseAppliance = document.querySelector(
  ".appliances-form .fa-solid.fa-angle-up"
);
const utensilBtn = document.querySelector(".filter-btn.red-clr");
const utensilForm = document.querySelector(".utensils-form-container");
const utensilsMenu = document.querySelector(".utensils-menu");
const angleUpCloseUtensils = document.querySelector(
  ".utensils-form .fa-solid.fa-angle-up"
);

// ----------------- VARIABLES -----------------
let filteredDataSearchBar;
let currentRecipesData = recipesArray;
let removedIngredients = [];
let removedAppliances = [];
let removedUtensils = [];

// ----------------- FUNCTIONS -----------------
/**
 * event listener function for filters menu
 * @param {Object} btn button DOM elements
 * @param {Object} form form DOM elements
 * @param {Object} icon icon DOM elements
 */
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
/**
 * function to display reicpes card
 * @param {Array} recipes recipes array
 */
const getRecipesCard = (recipes) => {
  recipes.forEach((recipe) => {
    const Template = new RecipeCard(recipe);
    recipeWrapper.appendChild(Template.createRecipeCard());
  });
};

/**
 * function to generate unique Filters list (no duplicate element)
 * @param {Array} recipes recipes array
 * @returns {Object} return object
 */
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

/**
 * function to remove recipes card and menu lists
 */
const removePage = () => {
  recipeWrapper.innerHTML = "";
  ingredientsMenu.innerHTML = "";
  appliancesMenu.innerHTML = "";
  utensilsMenu.innerHTML = "";
};

/**
 * function to close menu lists and display filters btn
 */
const closeMenuFilters = () => {
  ingredientBtn.classList.remove("remove");
  ingredientForm.classList.add("remove");
  applianceBtn.classList.remove("remove");
  applianceForm.classList.add("remove");
  utensilBtn.classList.remove("remove");
  utensilForm.classList.add("remove");
};

/**
 * function to filter recipes array with all filters values
 * @param {Array} array recipes array
 * @returns {Array} recipes filtered array
 */
const recipesArrayFilter = (array) => {
  // if there is no filter retun array
  if (
    removedIngredients.length == 0 &&
    removedAppliances.length == 0 &&
    removedUtensils.length == 0
  ) {
    return array;
  }
  // remove ingredients filter if any
  if (removedIngredients.length > 0) {
    removedIngredients.forEach((element) => {
      array = array.filter((recipe) => {
        return recipe.ingredients.some((ingre) =>
          ingre.ingredient.toLowerCase().includes(element)
        );
      });
    });
  }
  // remove appliances filter if any
  if (removedAppliances.length > 0) {
    removedAppliances.forEach((element) => {
      array = array.filter((recipe) => {
        return recipe.appliance.toLowerCase().includes(element);
      });
    });
  }
  // remove utensils filter if any
  if (removedUtensils.length > 0) {
    removedUtensils.forEach((element) => {
      array = array.filter((recipe) => {
        return recipe.ustensils.some((utensil) =>
          utensil.toLowerCase().includes(element)
        );
      });
    });
  }
  return array;
};

/**
 * function to create list menu and actions on click
 * @param {Array} arrayElementFilter array of unique element (ingredients, appliances...)
 * @param {Object} appendElement DOM container menu
 * @param {String} name list type indentification (ingredients, appliances...)
 * @param {Array} removedElement array of removed elements
 */
const createElementList = (
  arrayElementFilter,
  appendElement,
  name,
  removedElement
) => {
  // remove previous list menu
  appendElement.innerHTML = "";
  // create elements list item
  arrayElementFilter.forEach((item) => {
    const arrayElement = document.createElement("li");
    arrayElement.setAttribute("class", `list-element ${name}`);
    arrayElement.textContent = item;
    appendElement.appendChild(arrayElement);
    // event listener from each array Element
    arrayElement.addEventListener("click", () => {
      // get selected inner HTML ingredient from list
      let tagValue = arrayElement.innerHTML.toLowerCase();
      // create tag
      const tag = new Tags(tagValue, name);
      const htmlTag = tag.createTag();
      // append on tag container
      tagContainer.appendChild(htmlTag);
      // add removed element to array
      removedElement.push(tagValue);
      // create new recipes array data filtered
      let newData;
      // filter recipes array with removed element
      if (name == "ingredient-item") {
        removedElement.forEach((element) => {
          newData = currentRecipesData.filter((recipe) => {
            return recipe.ingredients.some((ingre) =>
              ingre.ingredient.toLowerCase().includes(element)
            );
          });
        });
      } else if (name == "appliance-item") {
        removedElement.forEach((element) => {
          newData = currentRecipesData.filter((recipe) => {
            return recipe.appliance.toLowerCase().includes(element);
          });
        });
      } else if (name == "utensil-item") {
        removedElement.forEach((element) => {
          newData = currentRecipesData.filter((recipe) => {
            return recipe.ustensils.some(
              (utensil) => utensil.toLowerCase() == element
            );
          });
        });
      }
      // remove tag actions
      removeTag(htmlTag, name);
      // remove recipes card and menu lists
      removePage();
      // generate single elements array
      getRecipesCard(newData);
      const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
        getFilters(newData);
      removeElementFromMenuList(
        uniqueIngredients,
        uniqueApplicances,
        uniqueUtensils
      );
      // assign new recipes array (filtered)
      currentRecipesData = newData;
      // remove input value
      searchIngredientsInput.value = "";
      searchAppliancesInput.value = "";
      searchUtensilsInput.value = "";
      // close menu list
      closeMenuFilters();
    });
  });
};

/**
 * function to remove tag and generate new cards and lists menu
 * @param {Object} tag tag DOM element
 * @param {String} name element identification (ingredients, appliances...)
 */
const removeTag = (tag, name) => {
  // event listener on cross icon
  tag.querySelector("i").addEventListener("click", () => {
    let putBackElement;
    // remove element from array which contains all removed elements
    if (name == "ingredient-item") {
      putBackElement = removedIngredients.filter(
        (item) => !tag.querySelector("p").innerHTML.includes(item)
      );
      removedIngredients = putBackElement;
    } else if (name == "appliance-item") {
      putBackElement = removedAppliances.filter(
        (item) => !tag.querySelector("p").innerHTML.includes(item)
      );
      removedAppliances = putBackElement;
    } else if (name == "utensil-item") {
      putBackElement = removedUtensils.filter(
        (item) => !tag.querySelector("p").innerHTML.includes(item)
      );
      removedUtensils = putBackElement;
    }
    // remove html tag
    tag.remove();
    // take initial recipes array
    let newArrayData;
    filteredDataSearchBar
      ? (newArrayData = filteredDataSearchBar)
      : (newArrayData = recipesArray);
    // filter recipes array with all removed elements
    currentRecipesData = recipesArrayFilter(newArrayData);
    // remove page elements
    removePage();
    // generate single ingredient array
    getRecipesCard(currentRecipesData);
    const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
      getFilters(currentRecipesData);
    // remove tag element from menu lists
    removeElementFromMenuList(
      uniqueIngredients,
      uniqueApplicances,
      uniqueUtensils
    );
    // close menu lists
    closeMenuFilters();
  });
};

/**
 * generate recipes card and menu lists (initial value)
 * @param {Array} recipes
 */
const generatePage = (recipes) => {
  getRecipesCard(recipes);
  const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
    getFilters(recipes);
  removeElementFromMenuList(
    uniqueIngredients,
    uniqueApplicances,
    uniqueUtensils
  );
};

/**
 * remove tag element from menu list
 * @param {Array} ingredient
 * @param {Array} appliance
 * @param {Array} utensil
 */
const removeElementFromMenuList = (ingredient, appliance, utensil) => {
  // remove tags from ingredient list
  let removeIngredientFromList = ingredient.filter(
    (element) => !removedIngredients.includes(element)
  );
  // remove tags from ingredient list
  let removeApplianceFromList = appliance.filter(
    (element) => !removedAppliances.includes(element)
  );
  // remove tags from ingredient list
  let removeUtensilFromList = utensil.filter(
    (element) => !removedUtensils.includes(element)
  );
  // create ingredient menu list
  createElementList(
    removeIngredientFromList,
    ingredientsMenu,
    "ingredient-item",
    removedIngredients
  );
  createElementList(
    removeApplianceFromList,
    appliancesMenu,
    "appliance-item",
    removedAppliances
  );
  createElementList(
    removeUtensilFromList,
    utensilsMenu,
    "utensil-item",
    removedUtensils
  );
};

/**
 * Event listener on input area and actions to update list menu
 * @param {Object} htmlInput
 * @param {Array} removedArray
 * @param {Object} htmlMenu
 * @param {String} inputName
 */
const inputEvenListener = (htmlInput, htmlMenu, inputName) => {
  // event listener on input html
  htmlInput.addEventListener("input", (e) => {
    let inputValue = e.target.value.toLowerCase();
    // display filtered data on ingredient search form
    const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
      getFilters(currentRecipesData);
    let filteredElement;
    if (inputName == "ingredient-item") {
      filteredElement = uniqueIngredients.filter((ingredient) => {
        return ingredient.includes(inputValue);
      });
      // filter elements regarding input value and create list menu
      if (removedIngredients.length > 0) {
        let remainElement = filteredElement.filter(
          (element) => !removedIngredients.includes(element)
        );
        createElementList(
          remainElement,
          htmlMenu,
          inputName,
          removedIngredients
        );
      } else {
        createElementList(
          filteredElement,
          htmlMenu,
          inputName,
          removedIngredients
        );
      }
    } else if (inputName == "appliance-item") {
      filteredElement = uniqueApplicances.filter((appliance) => {
        return appliance.includes(inputValue);
      });
      // filter elements regarding input value and create list menu
      if (removedAppliances.length > 0) {
        let remainElement = filteredElement.filter(
          (element) => !removedAppliances.includes(element)
        );
        createElementList(
          remainElement,
          htmlMenu,
          inputName,
          removedAppliances
        );
      } else {
        createElementList(
          filteredElement,
          htmlMenu,
          inputName,
          removedAppliances
        );
      }
    } else if (inputName == "utensil-item") {
      filteredElement = uniqueUtensils.filter((utensil) => {
        return utensil.includes(inputValue);
      });
      // filter elements regarding input value and create list menu
      if (removedUtensils.length > 0) {
        let remainElement = filteredElement.filter(
          (element) => !removedUtensils.includes(element)
        );
        createElementList(remainElement, htmlMenu, inputName, removedUtensils);
      } else {
        createElementList(
          filteredElement,
          htmlMenu,
          inputName,
          removedUtensils
        );
      }
    }
  });
};

/**
 * initial function
 */
const init = () => {
  // generate initial page with all recipes
  generatePage(currentRecipesData);
  // search bar event listener and actions
  serachBarInput.addEventListener("input", (e) => {
    removePage();
    const inputValue = e.target.value.toLowerCase();
    // filter recipes data
    filteredDataSearchBar = new FilterSearchBar(
      recipesArray,
      inputValue
    ).mainFilterRecipes();
    if (filteredDataSearchBar.length == 0) {
      recipeWrapper.innerHTML = `<p class="no-fund-message">
      Aucune recette ne correspond à votre critère… vous pouvez chercher «
      tarte aux pommes », « poisson », etc.
    </p>`;
    } else {
      currentRecipesData = filteredDataSearchBar;
      generatePage(filteredDataSearchBar);
    }
    // remove tag if event on search bar
    removedIngredients = [];
    removedAppliances = [];
    removedUtensils = [];
    tagContainer.innerHTML = "";
  });
  // Event listener on input

  inputEvenListener(searchIngredientsInput, ingredientsMenu, "ingredient-item");
  inputEvenListener(searchAppliancesInput, appliancesMenu, "appliance-item");
  inputEvenListener(searchUtensilsInput, utensilsMenu, "utensil-item");
};

init();
