/**
 * Class to filter main search data
 */
export default class FilterSearchBar {
  /**
   *
   * @param {Array} recipes recipes array
   * @param {String} input value of input data
   */
  constructor(recipes, input) {
    this._recipes = recipes;
    this._input = input;
  }

  /**
   * @property {Function} mainFilterRecipes create a new filtered array
   * @returns {Array} filtered data
   */
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
