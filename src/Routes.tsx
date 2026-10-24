import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import CriarPersonagemContainer from "./pages/enigma-sol-oculto/criar-personagem/criar-personagem.container";
import EnigmaSolOcultoPersonagem from "./pages/enigma-sol-oculto/enigma-sol-oculto-personagem.component";
import EnigmaSolOcultoContainer from "./pages/enigma-sol-oculto/enigma-sol-oculto.container";
import LoginContainer from "./pages/login/Login.container";
import MainPageContainer from "./pages/main/Main.container";
import SignUpContainer from "./pages/sign-up/SignUp.container";
import ThemeScope from "./components/ThemeScope.component";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<MainPageContainer />} />
          <Route path="login" element={<LoginContainer />} />
          <Route path="sign-up" element={<SignUpContainer />} />
          <Route
            path="enigma-sol-oculto"
            element={
              <ThemeScope theme="sol-oculto">
                <Outlet />
              </ThemeScope>
            }
          >
            <Route path="personagem" element={<EnigmaSolOcultoContainer />} />
            <Route
              path="personagem/criar"
              element={<CriarPersonagemContainer />}
            />
            <Route
              path="personagem/:nomePersonagem"
              element={<EnigmaSolOcultoPersonagem />}
            />
          </Route>
          <Route
            path="uivo-do-lobisomem/personagem"
            element={<>Quase lá...</>}
          />
          <Route path="sobre-a-aplicacao" element={<>Sobre a Aplicação</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
