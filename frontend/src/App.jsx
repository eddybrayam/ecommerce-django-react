import { BrowserRouter, Routes, Route } from "react-router-dom";

import TechStoreHomepage from "./pages/TechStoreHomepage";
import Login from "./pages/Login";
import RegisterClient from "./pages/RegisterClient";
import Activate from "./pages/Activate";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TechStoreHomepage />} /> 
        <Route path="/home" element={<Home />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterClient />} />
        <Route path="/activate/:uidb64/:token" element={<Activate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
