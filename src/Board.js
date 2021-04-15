import React, { Component } from "react";

import "./Board.css";
import Chessboard from 'chessboardjsx';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import StickyHeadTable from './StickyHeadTable';
const Chess = require("chess.js");

export default class Board extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        }
        this.inputFen = "";
        this.games = [{}];
        this.whiteMove = true;
        this.deleteNextSwitch = false;
        this.deleteNext = this.deleteNext.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.onSquareClick = this.onSquareClick.bind(this);
        this.insertFen = this.insertFen.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this.getFenInfo = this.getFenInfo.bind(this);
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
        if (event.value === "White to Move") {
            this.whiteMove = true;
        } else {
            this.whiteMove = false;
        }
    }

    getFenInfo = () => {
        let firstSpace = this.state.fen.indexOf(" ");
        let sub = this.state.fen.substr(0, firstSpace);
        let whiteMoveChar = this.whiteMove ? "White" : "Black"
        console.log(sub + " " + whiteMoveChar);   
        let request = new XMLHttpRequest();
        request.open('GET', "http://localhost:5000/positionQuery", true);
        request.setRequestHeader('position', sub);
        request.setRequestHeader('nextMove', whiteMoveChar);
        request.onload = function() {
            if (request.status !== 200) { // analyze HTTP status of the response
                alert(`Error ${request.status}: ${request.statusText}`); // e.g. 404: Not Found
                this.setState({
                    games: [],
                })
            } else { // show the result
                let json = JSON.parse(request.response);
                this.setState({
                    games: json,
                });
            }
        }.bind(this);
        request.onerror = function() {
            this.setState({
                games: [],
            })
        }.bind(this);
        request.send();
    }

    render() {
        return (
            <div className="Board">
                <div className="ChessBoard">
                    <Chessboard
                        position={this.state.fen}
                        onDrop={this.onDrop}
                        dropOffBoard="trash"
                        onPieceClick={this.onPieceClick}
                        onSquareClick={this.onSquareClick}
                        sparePieces={false} // false for now, maybe if there's time
                    />
                </div>
                <div className="Controls">
                    <div className="ControlBoard">Control Board:</div>
                    <div>
                        <button className="myButton" onClick={this.resetBoard}>Reset Board</button>
                    </div>
                    <div>
                        <button className="myButton"  onClick={this.deleteNext}>Delete Next Click</button>
                    </div>
                    <div>
                        <input className="TextBox" type="text" onChange={this.insertFen} />
                    </div>
                    <div>
                        <input
                            className="myButton" 
                            type="button"
                            value="Import FEN position"
                            onClick={this.handleClick}
                        />
                    </div>
                    
                    
                    <Dropdown
                        className="DropDown"
                        options={['White to Move', 'Black to Move']}
                        onChange={this._onSelect}
                        value={'White to Move'}
                        placeholder="Select an option"
                    />

                    <input
                        className="myButton2"
                        type="button"
                        value="Get Games"
                        onClick={this.getFenInfo}
                    />  
                </div>
                <div className="GameInfo">
                    {this.games.length === 0 ?
                    <h2 className="h2">No Games Available</h2>:
                    <div><h2 className="h3">Games Available:</h2>
                    <StickyHeadTable />
                    </div>}
                </div>
                
            </div>
        )
    }
}
