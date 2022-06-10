export default class Filters {
  constructor(data) {
    this._name = data.name;
    this._ingredients = data.ingredients;
    this._time = data.time;
    this._description = data.description;
    this._appliance = data.appliance;
    this._ustensils = data.ustensils;
  }

  displayIngredientsList() {
    let ingredientsArray = [];
    this._ingredients.forEach((element) => {
      ingredientsArray.push(element.ingredient.toLowerCase());
    });

    return ingredientsArray;
  }

  displayUtensilsList() {
    let utensilsArray = [];
    this._ustensils.forEach((element) => {
      utensilsArray.push(element.toLowerCase());
    });

    return utensilsArray;
  }
}
