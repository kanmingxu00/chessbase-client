import React, { Component } from "react";

import Chessboard from 'chessboardjsx';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
const Chess = require("chess.js");


export default class Board extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        }
        this.inputFen = "";
        this.whiteMove = true;
        this.deleteNextSwitch = false;
        this.deleteNext = this.deleteNext.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.onSquareClick = this.onSquareClick.bind(this);
        this.insertFen = this.insertFen.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this.printFen = this.printFen.bind(this);
    }

    componentDidMount() {
        this.game = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    }

    onSquareClick = (square) => {
        if (this.deleteNextSwitch) {
            this.game.remove(square);
            this.deleteNextSwitch = false;
            this.setState({
                fen: this.game.fen(),
            })
        }
    }

    deleteNext = () => {
        this.deleteNextSwitch = true;
    }

    onDrop = ({ sourceSquare, targetSquare }) => {
        let piece;
        if (sourceSquare !== "spare") {
            piece = this.game.remove(sourceSquare);
        } else {
            piece = null;
            console.log("todo");
        }

        this.game.put(piece, targetSquare);

        this.setState({
            fen: this.game.fen(),
        });
    };

    resetBoard = () => {
        this.game = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        this.setState({
            fen: this.game.fen(),
        });
    }

    insertFen = (e) => {
        this.inputFen = e.target.value;
    }

    handleClick = () => {
        let pos = this.inputFen + " w KQkq - 0 1";
        console.log(pos);
        this.game = new Chess(pos);
        console.log(this.game.fen());
        this.setState({
            fen: this.game.fen(),
        });
    }

    _onSelect = (event) => {
        if (event.value == "White to Move") {
            this.whiteMove = true;
        } else {
            this.whiteMove = false;
        }
    }

    printFen = () => {
        let firstSpace = this.state.fen.indexOf(" ");
        let sub = this.state.fen.substr(0, firstSpace);
        let nice = this.whiteMove ? "w" : "b"
        console.log(sub + " " + nice);   
    }

    render() {
        return (
            <div>
                <Chessboard
                    position={this.state.fen}
                    onDrop={this.onDrop}
                    dropOffBoard="trash"
                    onPieceClick={this.onPieceClick}
                    onSquareClick={this.onSquareClick}
                    sparePieces={false} // false for now, maybe if there's time
                />
                <button onClick={this.resetBoard}>"Reset Board"</button>
                <button onClick={this.deleteNext}>"DeleteNextClick"</button>
                <input type="text" onChange={this.insertFen} />
                <input
                    type="button"
                    value="Import FEN position"
                    onClick={this.handleClick}
                />
                <Dropdown
                    options={['White to Move', 'Black to Move']}
                    onChange={this._onSelect}
                    value={'White to Move'}
                    placeholder="Select an option"
                />
                <input
                    type="button"
                    value="Print fen"
                    onClick={this.printFen}
                />
            </div>
        )
    }
}