import { Component } from "react";

export default class CardComponent extends Component {
    render() {
        let card = this.props.card;
        return (
            <div className="card" id={`card-${card.id}`}>
                <div className="card-top" id={`card-top-${card.id}`}></div>
                <div className="card-base" id={`card-base-${card.id}`}>
                    <span>{card.label}</span>
                </div>
            </div>
        );
    }

    componentDidMount() {
        let id = this.props.card.id;
        document.querySelector(`#card-${id}`).addEventListener('click', this.props.clickHandler);
    }
}
