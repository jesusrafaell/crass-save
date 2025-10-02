interface Breakpoints {
  small: string;
  medium: string;
  large: string;
  xlarge: string;
}

const breakpoints: Breakpoints = {
  small: "480px",
  medium: "768px",
  large: "1024px",
  xlarge: "1200px",
};

const colors = {
  primary: "#5649ff",
};

const themes = {
  light: {
    backgroundColor: "#fff",
    color: "#000",
    invertedColor: "#fff",
    disabledColor: "rgba(0,0,0,.4)",
    boxShadowColor: "rgba(0, 0, 0, 0.2)",
    colors,
    breakpoints,
  },
  dark: {
    backgroundColor: "#000",
    color: "#fff",
    invertedColor: "#000",
    disabledColor: "rgba(255,255,255,.4)",
    boxShadowColor: "rgba(255, 255, 255, 0.2)",
    colors,
    breakpoints,
  },
};

export default themes;
