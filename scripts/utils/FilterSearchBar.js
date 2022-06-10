export default class FilterSearchBar {
  constructor(recipes, input) {
    this._recipes = recipes;
    this._input = input;
  }

  mainFilterRecipes() {
    if (this._input.length > 2) {
      const filteredRecipes = this._recipes.filter((recipe) => {
        return (
          recipe.name.toLowerCase().includes(this._input) ||
          recipe.description.toLowerCase().includes(this._input) ||
          recipe.ingredients.some((element) =>
            element.ingredient.toLowerCase().includes(this._input)
          )
        );
      });
      return filteredRecipes;
    } else {
      return this._recipes;
    }
  }
}
