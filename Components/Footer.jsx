// Footer.jsx
import React from "react";
import "./Imagepreview.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="email">📧 yogeshmishra@example.com</p>
      <div className="social-icons">
        <a href="https://www.linkedin.com/in/yogesh-kumar-mishra-b380a7337/" target="_blank" rel="noreferrer">
          <FaLinkedin className="icon" />
        </a>
        <a href="https://github.com/takashi-mishra" target="_blank" rel="noreferrer">
          <FaGithub className="icon" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
