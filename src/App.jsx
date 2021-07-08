import { Component } from "react";
import CardComponent from './card-component';
import { Card, MyArray } from "./util";
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
  }

  render() {
    return (
      <main>
        <h1>Flash Memory</h1>
        <p>Match the word with its meaning by turning over the matching cards.</p>
        <section id="game">
          {
            this.cards.shuffle().map(card => <CardComponent key={card.id} card={card} />)
          }
        </section>
      </main>
    );
  }
}
