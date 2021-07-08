import { Component } from "react";

export default class CardComponent extends Component {
    render() {
        let card = this.props.card;
        return (
            <div className="card">
                <div className="card-top" id={`card-top-${card.id}`}></div>
                <div className="card-base" id={card.id} pairswith={card.pairsWith}>
                    <svg viewBox="0 0 56 18">
                        <text x="0" y="15">{card.label}</text>
                    </svg>
                </div>
            </div>
        );
    }

    componentDidMount() {
        let id = this.props.card.id;
        document.querySelector(`#card-top-${id}`).addEventListener('click', event => {
            event.target.classList.add('card-clicked');
            setTimeout(() => {
                document.querySelector(`#card-top-${id}`).classList.remove('card-clicked');
            }, 1000);
        })
    }
}
