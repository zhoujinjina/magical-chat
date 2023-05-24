import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Registers";
import SetAvatar from "./pages/SetAvatar";
const App=()=>{
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<Chat />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Register/>} path="/register" />
          <Route element={<SetAvatar/>} path="/setAvatar" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
