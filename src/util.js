export class Card {
  constructor(label, id, pairsWith) {
    this.label = label;
    this.id = id;
    this.pairsWith = pairsWith;
  }
}


//taken and modified from https://javascript.info/task/shuffle
export class MyArray extends Array {
  shuffle() {
    let out = [...this];
    for (let i = out.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

      // swap elements out[i] and out[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = out[i]; out[i] = out[j]; out[j] = t
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
}

export function flipCard(id) {
  let card = document.querySelector(`#card-top-${id}`);
  card.classList.toggle('card-clicked');
}
