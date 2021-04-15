import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Board from './Board'
import Home from './Home'
import Upload from './Upload'
import PlayerEdit from './PlayerEdit'

function App() {
  return (
    <Router className="Flex">
      <div>
        <nav>
          <ul className="List">
            <li className="Objects">
              <Link className="Link" to="/">Home</Link>
            </li>
            <li className="Objects">
              <Link className="Link" to="/searchPos">Search position</Link>
            </li>
            <li className="Objects">
              <Link className="Link" to="/uploadGames">Upload Games</Link>
            </li>
            <li className="Objects">
              <Link className="Link" to="/playerEdit">Edit Players</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/searchPos">
            <Board />
          </Route>
          <Route path="/uploadGames">
            <Upload />
          </Route>
          <Route path="/playerEdit">
            <PlayerEdit />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
