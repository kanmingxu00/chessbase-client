import React, { Component } from "react";
import "./PlayerEdit.css";

export default class PlayerEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.playerName = "";
        this.playerRank = "";
    }

    playerNameChange = (e) => {
        this.playerName = e.target.value;
    }

    playerRankChange = (e) => {
        this.playerRank = e.target.value;
    }



    onClick = () => {
        console.log(this.playerName);
        console.log(this.playerRank);
    }


    render() {
        return (
            <div className="Container">
                <h2 className="h2">Add Player Rank</h2>
                <div className="textcontain">
                    <input
                        type="text"
                        className="textbox"
                        placeholder="Player Name"
                        onChange={this.playerNameChange}
                    />
                </div>
                <div className="textcontain">
                    <input
                        type="text"
                        className="textbox"
                        placeholder="Player Rank"
                        onChange={this.playerRankChange}
                    />
                </div>
                <div>
                    <input type="button" value="Submit" onClick={this.onClick} className="myButtonSubmit"/>
                </div>
            </div>
            
        )
    }
}