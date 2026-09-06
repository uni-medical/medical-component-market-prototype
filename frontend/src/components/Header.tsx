import { NavLink } from "react-router-dom";
import { Brand } from "./Brand";

export function Header() {
  return <nav aria-label="Main navigation"><Brand /><div><NavLink to="/">Home</NavLink><NavLink to="/marketplace">Marketplace</NavLink><a href="https://github.com/uni-medical/medical-component-market-web-homepage">GitHub</a></div></nav>;
}
