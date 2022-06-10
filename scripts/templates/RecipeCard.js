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

    recipeCardBody.innerHTML = `
    <div class="recipe_card-body-header">
      <h2 class="recipe_card-title">${this._name}</h2>
      <div class="recipe_card-time">
        <p>${this._time} min</p>
        <i class="fa-regular fa-clock"></i>
      </div>
    </div>`;

    const recipeCardBodyContent = document.createElement("div");
    recipeCardBodyContent.classList.add("recipe_card-body-content");
    const recipeCardIngredients = document.createElement("div");
    recipeCardIngredients.classList.add("recipe_card-ingredients");
    const recipeCardDescription = document.createElement("div");
    recipeCardDescription.classList.add("recipe_card-description");
    recipeCardDescription.innerHTML = `<p>${this._description}</p>`;

    recipeCard.append(recipeCardBody);
    recipeCardBody.append(recipeCardBodyContent);
    recipeCardBodyContent.append(recipeCardIngredients, recipeCardDescription);

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
