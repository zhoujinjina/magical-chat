import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Registers from "./pages/Registers";
const App=()=>{
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<Chat />} path="/chat" />
          <Route element={<Login />} path="/login" />
          <Route element={<Registers/>} path="/registers" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
