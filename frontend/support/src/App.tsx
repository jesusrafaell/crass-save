import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Error404 from "./pages/Error404";
import VerifyEmail from "./pages/VerifyEmail";
import ChangePassword from "./pages/forgetPassword/ForgetPassword";
// import VerifyTruck from './pages/VerifyTrucker';
import DataForm from "./pages/DataForm";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/verify/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password/:token" element={<ChangePassword />} />
          <Route path="/data-form/:token" element={<DataForm />} />
          {/* <Route path='/verify-trucker' element={<VerifyTruck />} /> */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
