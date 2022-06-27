/**
 * Class to create tag card
 */
export default class Tags {
  /**
   *
   * @param {String} input element name
   * @param {String} identification element identification
   */
  constructor(input, identification) {
    this._input = input;
    this._identification = identification;
  }

  /**
   * @property {Function} createTag create a html tag
   * @returns {Object} element's tag
   */
  createTag() {
    const tagCard = document.createElement("div");
    tagCard.setAttribute("class", `tag ${this._identification}`);
    tagCard.innerHTML = `
        <p class="tag-name">${this._input}</p>
        <i class="fa-regular fa-circle-xmark"></i>
`;
    return tagCard;
  }
}
