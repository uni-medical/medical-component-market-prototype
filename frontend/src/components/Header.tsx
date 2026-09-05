import { Link, NavLink } from "react-router-dom";
export function Header() {
  return <nav aria-label="Main navigation"><Link to="/" className="brand">Medical Component Market</Link><div><NavLink to="/">Home</NavLink><NavLink to="/marketplace">Marketplace</NavLink><a href="https://github.com/uni-medical/medical-component-market-web-homepage">GitHub</a></div></nav>;
}
