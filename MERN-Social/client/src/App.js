// import { Routes } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';

import Body from "./components/body/Body";
import Headers from "./components/header/Headers";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Headers />
        <Body />
      </div>
    </BrowserRouter>
  );
}

export default App;
