import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import Error404 from "./pages/Error404";
import "./App.css";
import ChangePassword from "./pages/forgetPassword/ForgetPassword";
import VerifyTrucker from "./pages/trucker/VerifyTrucker";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/change-password/:token" element={<ChangePassword />} />
        <Route path="/verify-trucker" element={<VerifyTrucker />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
