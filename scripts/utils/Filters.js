/**
 * Class to create unique arrays of element: ingredients and utensils
 */
export default class Filters {
  /**
   *
   * @param {Array} data recipes
   */
  constructor(data) {
    /**
     * @property {Array} ingredients list of ingredients
     */
    this._ingredients = data.ingredients;
    /**
     * @property {Array} ustensils list of ustensils
     */
    this._ustensils = data.ustensils;
  }

  /**
   * @property {Function} displayIngredientsList create an unique array with ingredients
   * @returns {Array} new array ingredients
   */
  displayIngredientsList() {
    let ingredientsArray = [];
    this._ingredients.forEach((element) => {
      ingredientsArray.push(element.ingredient.toLowerCase());
    });

    return ingredientsArray;
  }

  /**
   * @property {Function} displayUtensilsList create an unique array with utensils
   * @returns {Array} new array utensils
   */
  displayUtensilsList() {
    let utensilsArray = [];
    this._ustensils.forEach((element) => {
      utensilsArray.push(element.toLowerCase());
    });

    return utensilsArray;
  }
}
