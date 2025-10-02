import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

:root {
  --foreground-rgb: light-dark(black, white);
  --background-start-rgb: light-dark(rgb(214, 219, 220), black);
  --background-end-rgb: light-dark(rgb(255, 255, 255), black);
}

body {
    background: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.color};
    transition: all .25s linear;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #5649ff transparent;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #5649ff;
  border-radius: 12px;
}

`;

export default GlobalStyle;
