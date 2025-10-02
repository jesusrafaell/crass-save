import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Error404 from "./pages/Error404";
import VerifyTruck from "./pages/VerifyTrucker";
import VerifyEmail from "./pages/VerifyEmail";
import ChangePassword from "./pages/forgetPassword/ForgetPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/change-password/:token" element={<ChangePassword />} />
          <Route path="/verify-trucker" element={<VerifyTruck />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
