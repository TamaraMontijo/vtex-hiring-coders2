import "./Nav.css";
import React from "react";
import { Link } from "react-router-dom";

export default (props) => (
  <aside className="menu-area">
    <nav className="menu">
      {/* Refatorar! */}
      <Link to="/">Início</Link>
      <Link to="/users">Usuários</Link>
      <Link to="/products">Produtos</Link>
    </nav>
  </aside>
);
