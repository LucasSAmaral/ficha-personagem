import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import CriarPersonagemContainer from "./pages/enigma-sol-oculto/criar-personagem/criar-personagem.container";
import EnigmaSolOcultoPersonagem from "./pages/enigma-sol-oculto/enigma-sol-oculto-personagem.component";
import EnigmaSolOcultoContainer from "./pages/enigma-sol-oculto/enigma-sol-oculto.container";
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
          <Route
            path="enigma-sol-oculto/personagem"
            element={<EnigmaSolOcultoContainer />}
          />
          <Route
            path="enigma-sol-oculto/personagem/criar"
            element={<CriarPersonagemContainer />}
          />
          <Route
            path="enigma-sol-oculto/personagem/:nomePersonagem"
            element={<EnigmaSolOcultoPersonagem />}
          />
          <Route
            path="uivo-do-lobisomem/personagem"
            element={<>Quase lá...</>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
