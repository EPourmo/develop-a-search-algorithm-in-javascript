/**
 * Class to filter main search data (native)
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
      let filteredData = [];
      for (let i = 0; i < this._recipes.length; i++) {
        if (this._recipes[i].name.toLowerCase().includes(this._input)) {
          filteredData.push(this._recipes[i]);
        }

        if (this._recipes[i].description.toLowerCase().includes(this._input)) {
          filteredData.push(this._recipes[i]);
        }

        if (
          this._recipes[i].ingredients.some((element) =>
            element.ingredient.toLowerCase().includes(this._input)
          )
        ) {
          filteredData.push(this._recipes[i]);
        }
      }

      let seen = {};
      let filteredRecipes = [];

      for (let i = 0; i < filteredData.length; i++) {
        if (!(filteredData[i].id in seen)) {
          filteredRecipes.push(filteredData[i]);
          seen[filteredData[i].id] = true;
        }
      }
      return filteredRecipes;
    } else {
      return this._recipes;
    }
  }
}
