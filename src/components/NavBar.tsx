"use client";

import "./NavBar.css";
import React, { use } from "react";
import { useState } from "react";

interface NavBarProps {
  userAuthenticated: boolean;
  userAuthenticatedHandler: (value: void) => void;
}
// Define the NavBar component
const NavBar = (props: NavBarProps) => {
  return (
    <div className="container-fluid sticky-top p-0 border-bottom">
      <nav
        className="navbar navbar-expand-md navbar-light bg-light p-3"
        aria-label="Fourth navbar example"
      >
        <a className="navbar-brand" aria-current="page" href="/">
          AutoFlash
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsExample04"
          aria-controls="navbarsExample04"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExample04">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item mx-3">
              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            <li className="nav-item mx-3">
              <a className="nav-link" href="/login">
                {props.userAuthenticated ? "Logout" : "Login/Signup"}
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          {!props.userAuthenticated && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => props.userAuthenticatedHandler()}
            >
              Login
            </button>
          )}
          {props.userAuthenticated && (
            <button type="button" className="btn btn-secondary">
              <a className="dropdown-item" href="/my-cards">
                My Cards
              </a>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
