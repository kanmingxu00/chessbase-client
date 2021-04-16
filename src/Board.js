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
        this.inputName = "";
        this.inputSomeName = "";
        this.inputOpeningFen = "";
        this.games = [{}];
        this.whiteMove = true;
        this.deleteNextSwitch = false;
        this.deleteNext = this.deleteNext.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.onSquareClick = this.onSquareClick.bind(this);
        this.insertFen = this.insertFen.bind(this);
        this.insertOfficialFen = this.insertOfficialFen.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this.getFenInfo = this.getFenInfo.bind(this);
    }

    componentDidMount() {
        this.game = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    }

    // Deletes piece if the boolean is clicked.
    onSquareClick = (square) => {
        if (this.deleteNextSwitch) {
            this.game.remove(square);
            this.deleteNextSwitch = false;
            this.setState({
                fen: this.game.fen(),
            })
        }
    }

    // Delete the next piece you click, sets the boolean
    deleteNext = () => {
        this.deleteNextSwitch = true;
    }

    // Helper function for dropping a piece down, updates all the fens
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

    // Resets the board
    resetBoard = () => {
        this.game = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        this.setState({
            fen: this.game.fen(),
        });
    }

    // Changes inputFen to match text box
    insertFen = (e) => {
        this.inputFen = e.target.value;
    }

    // Changes inputOpeningFen to match text box
    insertOfficialFen = (e) => {
        this.inputOpeningFen = e.target.value;
    }

    // Changes inputName to match
    insertOpeningName = (e) => {
        this.inputName = e.target.value;
    }

    // Changes inputSomeName to match the search value
    insertSomeOpeningName = (e) => {
        this.inputSomeName = e.target.value;
    }

    // Handles the click of import FEN position button, sets fen to the text
    handleClick = () => {
        let pos = this.inputFen + " w KQkq - 0 1";
        console.log(pos);
        this.game = new Chess(pos);
        console.log(this.game.fen());
        this.setState({
            fen: this.game.fen(),
        });
    }

    // takes new opening position (either from fen or board), and inserts it into server
    handleNewOpening = () => {
        let openingFen = "";
        let colorMove = "";
        let openingName = this.inputName;
        if (this.inputOpeningFen === "") {
            let firstSpace = this.state.fen.indexOf(" ");
            openingFen = this.state.fen.substr(0, firstSpace);
            colorMove = this.whiteMove ? "w" : "b"
        } else {
            let firstSpace = this.inputOpeningFen.indexOf(" ");
            openingFen = this.inputOpeningFen.substr(0, firstSpace);
            colorMove = this.inputOpeningFen.substr(firstSpace+1, 1);
        }
        console.log(openingFen);
        console.log(colorMove);
        console.log(openingName);
        // TODO:
    }

    // Searches for an opening name and sets it onto the board via state
    // Gets a position with the search basically
    handleOpeningSearch = () => {
        if (this.inputSomeName !== "") {
            console.log(this.inputSomeName)
        }
    
        //TODO
    }

    // Select white to move or black to move and set it to whitemove boolean
    _onSelect = (event) => {
        if (event.value === "White to Move") {
            this.whiteMove = true;
        } else {
            this.whiteMove = false;
        }
    }

    // Gets the information of the position from server and sets it to game
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
                <div>
                    <div className="OpeningControls">
                        <div className="ControlBoard">Openings:</div>

                        <div>
                            <input className="TextBox" type="text" placeholder={"Search Openings"} onChange={this.insertSomeOpeningName} />
                        </div>
                        <div>
                            <input
                                className="myButton" 
                                type="button"
                                value="Enter Opening Name"
                                onClick={this.handleOpeningSearch}
                            />
                        </div>

                        <div>
                            <input className="TextBox" type="text" placeholder={"FEN (use board if empty)"} onChange={this.insertOfficialFen} />
                        </div>
                        <div className="OpeningName">
                            <input className="HalfTextBox" type="text" placeholder={"Name"} onChange={this.insertOpeningName} />
                            <div>
                                <input
                                    className="myButton" 
                                    type="button"
                                    value="Import"
                                    onClick={this.handleNewOpening}
                                />
                            </div>
                        </div>
                        
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
                            <input className="TextBox" type="text" placeholder={"Position FEN"} onChange={this.insertFen} />
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
                            value={this.whiteMove ? 'White to Move' : "Black to Move"}
                            placeholder="Select an option"
                        />

                        <input
                            className="myButton2"
                            type="button"
                            value="Get Games"
                            onClick={this.getFenInfo}
                        />  
                    </div>  
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
