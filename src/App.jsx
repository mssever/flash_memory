import { Component } from "react";
import CardComponent from './card-component';
import { Card, MyArray, flipCard } from "./util";
import { korean_numbers as word_list } from "./data/lists";
import 'bootstrap/dist/css/bootstrap.css'
import './App.scss';

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
    this.cards = this.cards.shuffle();
    
    this.cardsClicked = [];
    this.score = 0;
    this.lock = false;
    this.cardsMatched = 0;
    this.state = {
      score: this.getScore(),
      gameOver: null,
      cards: this.cards
    }

    this.handleCardClick = this.handleCardClick.bind(this);
    this.play = this.play.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.reset = this.reset.bind(this);
    this.generateBackgrounds = this.generateBackgrounds.bind(this);
  }
  
  play() {
    this.lock = true;
    let [a, b] = this.cardsClicked;
    if(a.id == b.pairsWith) {
      this.cardsClicked.forEach(card => {
        let baseEl = document.querySelector(`#card-base-${card.id}`);
        baseEl.classList.add('card-solved');
        let cardEl = document.querySelector(`#card-${card.id}`);
        cardEl.classList.add('card-solved');
      });
      this.cardsClicked = [];
      this.lock = false;
      this.score += 10;
      this.cardsMatched += 2;
      if(this.cardsMatched == this.flat_list.length) {
        this.gameOver();
      }
    } else {
      this.score--;
      setTimeout(() => {
        this.cardsClicked.forEach(card => flipCard(card.id));
        this.cardsClicked = [];
        this.lock = false;
      }, 1000);
    }
    this.setState({score: this.getScore()});
  }

  gameOver() {
    setTimeout(() => {
      this.setState({
        gameOver: (
          <div className="modal-background">
            <div className="container">
              <p>Game over. Score: {this.getScore()}</p>
              <button className="btn btn-light" onClick={this.reset}>Restart</button>
            </div>
          </div>
        )
      })
    }, 150);
  }

  reset() {
    this.score = 0;
    this.cardsClicked = [];
    this.lock = false;
    this.cardsMatched = 0;
    this.cards = this.cards.shuffle();
    let cards = document.querySelectorAll('.card-solved');
    for(let i=0; i<cards.length; i++) {
      cards[i].classList.remove('card-solved');
    }
    this.cards.forEach(card => flipCard(card.id));
    this.setState({
      score: this.getScore(),
      gameOver: null,
      cards: this.cards
    })
  }

  getScore() {
    let score = this.score;
    let total = this.flat_list.length * 5;
    let pct = Math.round((score / total) * 100);
    return `${score}/${total} (${pct}%)`;
  }

  handleCardClick(event) {
    if(this.lock) return true;
    let target = event.target;
    while (!/card-[0-9]+/.test(target.id)) target = target.parentNode;
    if(target.classList.contains('card-solved') || target.children[0].classList.contains('card-clicked')) {
      return true;
    }
    const target_id_num = target.id.match(/[0-9]+/)[0];
    const card = this.cards.find(card => card.id == target_id_num);
    flipCard(card.id);
    if(this.cardsClicked.length == 0) {
      this.cardsClicked.push(card);
    } else if (this.cardsClicked.length == 1) {
      if(card.id == this.cardsClicked[0].id) {
        this.cardsClicked.pop();
      } else {
        this.cardsClicked.push(card);
        this.play();
      }
    }
  }

  render() {
    return (
      <main>
        <style>
          {`
            #game {
              background-image: ${this.state.bgtable};
            }

            .card-top, .container {
              background-image: ${this.state.bgback};
            }

            .card-base {
              background-image: ${this.state.bgfront};
            }

            .card-solved {
              background-image: ${this.state.bgcorrect};
            }
          `}
        </style>
        <header>
          <h1>Flash Memory</h1>
          <p>Match the word with its meaning by turning over the matching cards.</p>
        </header>
        <p id="score">Score: {this.state.score}</p>
        <div id="game-over">{this.state.gameOver}</div>
        <section id="game">
          {
            this.state.cards.map(card => <CardComponent 
                                                key={card.id}
                                                card={card}
                                                clickHandler={this.handleCardClick}
                                                bgfront={this.state.bgfront}
                                                bgback={this.state.bgback}
                                               />)
          }
        </section>
      </main>
    );
  }

  componentDidMount() {
    this.generateBackgrounds();
  }

  generateBackgrounds() {
    function background(color, tileSize=7, borderWidth=3, tiles=15) {
      return `https://php-noise.com/noise.php?hex=${color}&tiles=${tiles}&tileSize=${tileSize}&borderWidth=${borderWidth}&json`;
    }

    function url(addr) {
      return `url(${addr})`;
    }

    let bgcorrect, bgfront, bgback, bgtable;
    fetch(background('198754', 7, 15)) // correct
      .then(response => response.json())
      .then(data => {
        bgcorrect = url(data.uri);
        fetch(background('fd7e14')) // front
          .then(response => response.json())
          .then(data => {
            bgfront = url(data.uri);
            fetch(background('0d6efd', 10)) // back
              .then(response => response.json())
              .then(data => {
                bgback = url(data.uri);
                fetch(background('999999', 10, 0, 50)) // table
                  .then(response => response.json())
                  .then(data => {
                    bgtable = url(data.uri);
                    this.setState({
                      bgcorrect,
                      bgfront,
                      bgback,
                      bgtable
                    });
                  });
              });
          });
      });
  }
}
