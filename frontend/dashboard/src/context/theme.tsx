import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import StyledComponentsRegistry from "@/lib/registry";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import GlobalStyle from "@/app/GlobalStyle";
import themes from "@/utils/themes";

interface ThemeContextProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const storedTheme =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    } else {
      return "light";
    }
  });

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      <StyledComponentsRegistry>
        <StyledThemeProvider theme={themes[theme]}>
          <GlobalStyle />
          {children}
        </StyledThemeProvider>
      </StyledComponentsRegistry>
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
