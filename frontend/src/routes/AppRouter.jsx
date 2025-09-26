import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login/login";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}
