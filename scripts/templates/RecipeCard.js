export default class RecipeCard {
  constructor(data) {
    this._name = data.name;
    this._ingredients = data.ingredients;
    this._time = data.time;
    this._description = data.description;
  }

  createRecipeCard() {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe_card");
    const recipeCardBody = document.createElement("div");
    recipeCardBody.classList.add("recipe_card-body");

    const recipeCardBodyHeader = document.createElement("div");
    recipeCardBodyHeader.classList.add("recipe_card-body-header");
    const recipeCardBodyContent = document.createElement("div");
    recipeCardBodyContent.classList.add("recipe_card-body-content");

    const recipeCardTitle = document.createElement("h2");
    recipeCardTitle.classList.add("recipe_card-title");
    recipeCardTitle.textContent = this._name;
    const recipeCardTime = document.createElement("div");
    recipeCardTime.classList.add("recipe_card-time");
    const recipeCardTimeParagraph = document.createElement("p");
    recipeCardTimeParagraph.textContent = `${this._time} min`;
    const recipeCardTimeIcon = document.createElement("i");
    recipeCardTimeIcon.setAttribute("class", "fa-regular fa-clock");
    const recipeCardIngredients = document.createElement("div");
    recipeCardIngredients.classList.add("recipe_card-ingredients");
    const recipeCardDescription = document.createElement("div");
    recipeCardDescription.classList.add("recipe_card-description");
    const recipeCardDescriptionParagraph = document.createElement("p");
    recipeCardDescriptionParagraph.textContent = this._description;

    recipeCard.append(recipeCardBody);
    recipeCardBody.append(recipeCardBodyHeader, recipeCardBodyContent);
    recipeCardDescription.append(recipeCardDescriptionParagraph);
    recipeCardBodyHeader.append(recipeCardTitle, recipeCardTime);
    recipeCardBodyContent.append(recipeCardIngredients, recipeCardDescription);
    recipeCardTime.append(recipeCardTimeParagraph, recipeCardTimeIcon);

    this._ingredients.forEach((ingredient) => {
      const recipeIngredientParagraph = document.createElement("p");
      if (ingredient.quantity && ingredient.unit) {
        recipeIngredientParagraph.innerHTML = `<span>${ingredient.ingredient}:</span> ${ingredient.quantity} ${ingredient.unit}<br>`;
      } else if (!ingredient.quantity) {
        recipeIngredientParagraph.innerHTML = `<span>${ingredient.ingredient}</span><br>`;
      } else {
        recipeIngredientParagraph.innerHTML = `<span>${ingredient.ingredient}:</span> ${ingredient.quantity}<br>`;
      }

      recipeCardIngredients.appendChild(recipeIngredientParagraph);
    });

    return recipeCard;
  }
}
