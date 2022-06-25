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
const searchAppliancesInput = document.querySelector(
  ".search_appliances-input"
);
const searchUtensilsInput = document.querySelector(".search_utensils-input");
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
let removedAppliances = [];
let removedUtensils = [];

const createElementList = (array, appendElement, name, removedElement) => {
  appendElement.innerHTML = "";
  // create elements list item
  array.forEach((item) => {
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
      tagContainer.appendChild(htmlTag);

      removedElement.push(tagValue);
      // create new recipes array data filtered
      let newData;

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
      // create page elements
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
  removeElementFromMenuList(
    uniqueIngredients,
    uniqueApplicances,
    uniqueUtensils
  );
};

const closeMenuFilters = () => {
  ingredientBtn.classList.remove("remove");
  ingredientForm.classList.add("remove");
  applianceBtn.classList.remove("remove");
  applianceForm.classList.add("remove");
  utensilBtn.classList.remove("remove");
  utensilForm.classList.add("remove");
};

const removeTag = (tag, name) => {
  tag.querySelector("i").addEventListener("click", () => {
    let putBackElement;
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

    tag.remove();
    let newArrayData;
    filteredDataSB
      ? (newArrayData = filteredDataSB)
      : (newArrayData = recipesArray);

    currentRecipesData = recipesArrayFilter(newArrayData);
    // create page elements
    removePage();
    // generate single ingredient array
    getRecipesCard(currentRecipesData);

    const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
      getFilters(currentRecipesData);

    removeElementFromMenuList(
      uniqueIngredients,
      uniqueApplicances,
      uniqueUtensils
    );

    // close menu list
    closeMenuFilters();
  });
};

const recipesArrayFilter = (array) => {
  if (
    removedIngredients.length == 0 &&
    removedAppliances.length == 0 &&
    removedUtensils.length == 0
  ) {
    return array;
  }

  if (removedIngredients.length > 0) {
    removedIngredients.forEach((element) => {
      array = array.filter((recipe) => {
        return recipe.ingredients.some((ingre) =>
          ingre.ingredient.toLowerCase().includes(element)
        );
      });
    });
  }

  if (removedAppliances.length > 0) {
    removedAppliances.forEach((element) => {
      array = array.filter((recipe) => {
        return recipe.appliance.toLowerCase().includes(element);
      });
    });
  }

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

const inputEvenListener = (htmlInput, removedArray, htmlMenu, inputName) => {
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
    } else if (inputName == "appliance-item") {
      filteredElement = uniqueApplicances.filter((appliance) => {
        return appliance.includes(inputValue);
      });
    } else if (inputName == "utensil-item") {
      filteredElement = uniqueUtensils.filter((utensil) => {
        return utensil.includes(inputValue);
      });
    }

    if (removedArray.length > 0) {
      let remainElement = filteredElement.filter(
        (element) => !removedArray.includes(element)
      );
      createElementList(remainElement, htmlMenu, inputName, removedArray);
    } else {
      createElementList(filteredElement, htmlMenu, inputName, removedArray);
    }
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

    removedIngredients = [];
    removedAppliances = [];
    removedUtensils = [];
    tagContainer.innerHTML = "";
  });

  inputEvenListener(
    searchIngredientsInput,
    removedIngredients,
    ingredientsMenu,
    "ingredient-item"
  );

  inputEvenListener(
    searchAppliancesInput,
    removedAppliances,
    appliancesMenu,
    "appliance-item"
  );

  inputEvenListener(
    searchUtensilsInput,
    removedUtensils,
    utensilsMenu,
    "utensil-item"
  );
};

init();
