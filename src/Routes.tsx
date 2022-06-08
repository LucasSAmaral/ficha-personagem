import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginContainer from "./pages/login/Login.container";
import MainPageContainer from "./pages/main/Main.container";
import SignUpContainer from "./pages/sign-up/SignUp.container";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<MainPageContainer />} />
          <Route path="login" element={<LoginContainer />} />
          <Route path="sign-up" element={<SignUpContainer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
