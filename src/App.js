import "./App.css";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Exam from "./components/Exam";
import Results from "./components/Results";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="exam" element={<Exam questions={[]} />}></Route>
          <Route path="result" element={<Results questions={[]} />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
