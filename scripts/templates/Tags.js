export default class Tags {
  constructor(input, identification) {
    this._input = input;
    this._identification = identification;
  }

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
