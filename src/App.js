import React from "react";
import sona1 from "./clownsonas/clown1.svg"
import sona3 from "./clownsonas/clown3.svg"
import sona4 from "./clownsonas/clown4.svg"
import sona5 from "./clownsonas/clown5.svg"

const App = () => {
  var currentSona = 5;
  return (
    <div>
      <h1>React-Parcel-Template</h1>
      <h2> Remember to replace the URL in package.json!! </h2>
      {(currentSona === 1) && <img className={"logoPic"} src={sona1} alt="Logo" />}
      {(currentSona === 3) && <img className={"logoPic"} src={sona3} alt="Logo" />}
      {(currentSona === 4) && <img className={"logoPic"} src={sona4} alt="Logo" />}
      {(currentSona === 5) && <img className={"logoPic"} src={sona5} alt="Logo" />}
    </div>
  );
};

export default App;
