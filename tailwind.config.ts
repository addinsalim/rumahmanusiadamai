import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { brand: { green: "#118B44", lime: "#8CC63F", charcoal: "#58595B", mint: "#EFFAF3" } } } },
  plugins: []
};
export default config;
