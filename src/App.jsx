import { Component } from "react";
import CardComponent from './card-component';
import { Card, MyArray, flipCard } from "./util";
import { korean_numbers as word_list } from "./data/lists";
import './App.css';

export default class App extends Component {
  constructor() {
    super();

    this.flat_list = [];
    this.cards = new MyArray();
    let counter = 0;
    word_list.forEach(pair => {
      this.flat_list.push(pair[0]);
      this.flat_list.push(pair[1]);
      this.cards.push(new Card(pair[0], counter, counter+1));
      this.cards.push(new Card(pair[1], counter+1, counter))
      counter += 2;
    });

    this.cardsClicked = []

    this.handleCardClick = this.handleCardClick.bind(this);
  }

  handleCardClick(event) {
    //debugger
    let target = event.target;
    while (!/card-[0-9]+/.test(target.id)) target = target.parentNode;
    const target_id_num = target.id.match(/[0-9]+/)[0];
    const card = this.cards.find(card => card.id == target_id_num);
    this.cardsClicked.push(card)
    flipCard(card.id);
    //TODO: Implement game logic
  }

  render() {
    return (
      <main>
        <h1>Flash Memory</h1>
        <p>Match the word with its meaning by turning over the matching cards.</p>
        <section id="game">
          {
            this.cards.shuffle().map(card => <CardComponent 
                                                key={card.id}
                                                card={card}
                                                clickHandler={this.handleCardClick} />)
          }
        </section>
      </main>
    );
  }
}
