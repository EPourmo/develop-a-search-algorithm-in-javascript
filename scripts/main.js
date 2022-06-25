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

// function to generate menu from filters
const createFilterList = (array, appendElement, name) => {
  appendElement.innerHTML = "";
  array.forEach((item) => {
    const listElement = document.createElement("li");
    listElement.setAttribute("class", `list-element ${name}`);
    listElement.textContent = item;
    appendElement.appendChild(listElement);
  });
};

const createElementListIngredient = (array, appendElement, name) => {
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
      let newData;
      tagContainer.appendChild(htmlTag);

      removedIngredients.push(tagValue);
      // create new recipes array data filtered
      removedIngredients.forEach((element) => {
        newData = currentRecipesData.filter((recipe) => {
          return recipe.ingredients.some((ingre) =>
            ingre.ingredient.toLowerCase().includes(element)
          );
        });
      });

      // function to remove tag
      removeTag(htmlTag);
      // create page elements
      removePage();
      // generate single elements array
      getRecipesCard(newData);
      const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
        getFilters(newData);
      // remove tags from ingredient list
      let removeIngredientFromList = uniqueIngredients.filter(
        (element) => !removedIngredients.includes(element)
      );
      // remove tags from ingredient list
      let removeApplianceFromList = uniqueApplicances.filter(
        (element) => !removedAppliances.includes(element)
      );
      // remove tags from ingredient list
      let removeUtensilFromList = uniqueUtensils.filter(
        (element) => !removedUtensils.includes(element)
      );

      // create ingredient menu list
      createElementListIngredient(
        removeIngredientFromList,
        appendElement,
        name
      );
      // create appliance menu list
      createElementListAppliance(
        removeApplianceFromList,
        appliancesMenu,
        "appliance-item"
      );
      createElementListUtensil(
        removeUtensilFromList,
        utensilsMenu,
        "utensil-item"
      );
      // assign new recipes array (filtered)
      currentRecipesData = newData;
      // remove input value
      searchIngredientsInput.value = "";
      // close menu list
      closeMenuFilters();
    });
  });
};

const createElementListAppliance = (array, appendElement, name) => {
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
      let newData;
      tagContainer.appendChild(htmlTag);

      removedAppliances.push(tagValue);
      // function to remove tag
      removeTagAppliance(htmlTag);
      // create new recipes array data filtered
      removedAppliances.forEach((element) => {
        newData = currentRecipesData.filter((recipe) => {
          return recipe.appliance.toLowerCase().includes(element);
        });
      });

      // create page elements
      removePage();
      // generate single elements array
      getRecipesCard(newData);
      const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
        getFilters(newData);
      // remove tags from ingredient list
      let removeIngredientFromList = uniqueIngredients.filter(
        (element) => !removedIngredients.includes(element)
      );
      // remove tags from ingredient list
      let removeApplianceFromList = uniqueApplicances.filter(
        (element) => !removedAppliances.includes(element)
      );
      // remove tags from ingredient list
      let removeUtensilFromList = uniqueUtensils.filter(
        (element) => !removedUtensils.includes(element)
      );

      // create appliance menu list
      createElementListAppliance(removeApplianceFromList, appendElement, name);
      // create ingredient menu list
      createElementListIngredient(
        removeIngredientFromList,
        ingredientsMenu,
        "ingredient-item"
      );
      createElementListUtensil(
        removeUtensilFromList,
        utensilsMenu,
        "utensil-item"
      );
      // assign new recipes array (filtered)
      currentRecipesData = newData;
      // remove input value
      searchAppliancesInput.value = "";
      // close menu list
      closeMenuFilters();
    });
  });
};

const createElementListUtensil = (array, appendElement, name) => {
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
      let newData;
      tagContainer.appendChild(htmlTag);

      removedUtensils.push(tagValue);
      // function to remove tag
      removeTagUtensil(htmlTag);
      // create new recipes array data filtered
      removedUtensils.forEach((element) => {
        newData = currentRecipesData.filter((recipe) => {
          return recipe.ustensils.some(
            (utensil) => utensil.toLowerCase() == element
          );
        });
      });

      // create page elements
      removePage();
      // generate single elements array
      getRecipesCard(newData);
      const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
        getFilters(newData);
      // remove tags from ingredient list
      let removeIngredientFromList = uniqueIngredients.filter(
        (element) => !removedIngredients.includes(element)
      );
      // remove tags from ingredient list
      let removeApplianceFromList = uniqueApplicances.filter(
        (element) => !removedAppliances.includes(element)
      );
      // remove tags from ingredient list
      let removeUtensilFromList = uniqueUtensils.filter(
        (element) => !removedUtensils.includes(element)
      );
      // create appliance menu list
      createElementListUtensil(removeUtensilFromList, appendElement, name);
      // create ingredient menu list
      createElementListIngredient(
        removeIngredientFromList,
        ingredientsMenu,
        "ingredient-item"
      );
      createElementListAppliance(
        removeApplianceFromList,
        appliancesMenu,
        "appliance-item"
      );

      // assign new recipes array (filtered)
      currentRecipesData = newData;
      // remove input value
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
  createElementListIngredient(
    uniqueIngredients,
    ingredientsMenu,
    "ingredient-item"
  );
  createElementListAppliance(
    uniqueApplicances,
    appliancesMenu,
    "appliance-item"
  );
  createElementListUtensil(uniqueUtensils, utensilsMenu, "utensil-item");
};

const closeMenuFilters = () => {
  ingredientBtn.classList.remove("remove");
  ingredientForm.classList.add("remove");
  applianceBtn.classList.remove("remove");
  applianceForm.classList.add("remove");
  utensilBtn.classList.remove("remove");
  utensilForm.classList.add("remove");
};

const removeTag = (tag) => {
  tag.querySelector("i").addEventListener("click", () => {
    let putBackElement = removedIngredients.filter(
      (item) => !tag.querySelector("p").innerHTML.includes(item)
    );
    tag.remove();
    removedIngredients = putBackElement;

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
    // remove tags from ingredient list
    let removeIngredientFromList = uniqueIngredients.filter(
      (element) => !removedIngredients.includes(element)
    );
    // remove tags from ingredient list
    let removeApplianceFromList = uniqueApplicances.filter(
      (element) => !removedAppliances.includes(element)
    );
    // remove tags from ingredient list
    let removeUtensilFromList = uniqueUtensils.filter(
      (element) => !removedUtensils.includes(element)
    );
    // create ingredient menu list
    createElementListIngredient(
      removeIngredientFromList,
      ingredientsMenu,
      "ingredient-item"
    );
    createElementListAppliance(
      removeApplianceFromList,
      appliancesMenu,
      "appliance-item"
    );
    createElementListUtensil(
      removeUtensilFromList,
      utensilsMenu,
      "utensil-item"
    );
  });
};

const removeTagAppliance = (tag) => {
  tag.querySelector("i").addEventListener("click", () => {
    let putBackElement = removedAppliances.filter(
      (item) => !tag.querySelector("p").innerHTML.includes(item)
    );
    tag.remove();
    removedAppliances = putBackElement;

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
    // remove tags from ingredient list
    let removeIngredientFromList = uniqueIngredients.filter(
      (element) => !removedIngredients.includes(element)
    );
    // remove tags from ingredient list
    let removeApplianceFromList = uniqueApplicances.filter(
      (element) => !removedAppliances.includes(element)
    );
    // remove tags from ingredient list
    let removeUtensilFromList = uniqueUtensils.filter(
      (element) => !removedUtensils.includes(element)
    );
    // create ingredient menu list
    createElementListIngredient(
      removeIngredientFromList,
      ingredientsMenu,
      "ingredient-item"
    );
    createElementListAppliance(
      removeApplianceFromList,
      appliancesMenu,
      "appliance-item"
    );
    createElementListUtensil(
      removeUtensilFromList,
      utensilsMenu,
      "utensil-item"
    );
  });
};

const removeTagUtensil = (tag) => {
  tag.querySelector("i").addEventListener("click", () => {
    let putBackElement = removedUtensils.filter(
      (item) => !tag.querySelector("p").innerHTML.includes(item)
    );
    tag.remove();
    removedUtensils = putBackElement;

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
    // remove tags from ingredient list
    let removeIngredientFromList = uniqueIngredients.filter(
      (element) => !removedIngredients.includes(element)
    );
    // remove tags from ingredient list
    let removeApplianceFromList = uniqueApplicances.filter(
      (element) => !removedAppliances.includes(element)
    );
    // remove tags from ingredient list
    let removeUtensilFromList = uniqueUtensils.filter(
      (element) => !removedUtensils.includes(element)
    );
    // create ingredient menu list
    createElementListIngredient(
      removeIngredientFromList,
      ingredientsMenu,
      "ingredient-item"
    );
    createElementListAppliance(
      removeApplianceFromList,
      appliancesMenu,
      "appliance-item"
    );
    createElementListUtensil(
      removeUtensilFromList,
      utensilsMenu,
      "utensil-item"
    );
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
      createElementListIngredient(
        remainIngredients,
        ingredientsMenu,
        "ingredient-item"
      );
    } else {
      createElementListIngredient(
        filteredIngredients,
        ingredientsMenu,
        "ingredient-item"
      );
    }
  });

  searchAppliancesInput.addEventListener("input", (e) => {
    let inputValue = e.target.value.toLowerCase();
    // display filtered data on ingredient search form
    const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
      getFilters(currentRecipesData);
    let filteredAppliances = uniqueApplicances.filter((appliance) => {
      return appliance.includes(inputValue);
    });
    if (removedAppliances.length > 0) {
      let remainAppliance = filteredAppliances.filter(
        (element) => !removedAppliances.includes(element)
      );
      createElementListAppliance(
        remainAppliance,
        appliancesMenu,
        "appliance-item"
      );
    } else {
      createElementListAppliance(
        filteredAppliances,
        appliancesMenu,
        "appliance-item"
      );
    }
  });

  searchUtensilsInput.addEventListener("input", (e) => {
    let inputValue = e.target.value.toLowerCase();

    // display filtered data on ingredient search form
    const { uniqueIngredients, uniqueApplicances, uniqueUtensils } =
      getFilters(currentRecipesData);
    let filteredUtensils = uniqueUtensils.filter((utensil) => {
      return utensil.includes(inputValue);
    });

    if (removedUtensils.length > 0) {
      let remainUtensil = filteredUtensils.filter(
        (element) => !removedUtensils.includes(element)
      );

      createElementListUtensil(remainUtensil, utensilsMenu, "utensil-item");
    } else {
      createElementListUtensil(filteredUtensils, utensilsMenu, "utensil-item");
    }
  });
};

init();
