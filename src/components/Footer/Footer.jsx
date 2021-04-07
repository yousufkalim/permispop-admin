import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          <nav
            // className="pull-left"
            style={{}}
          >
            <ul>
              <li>
                <a href="#pablo">PermisPop</a>
              </li>
            </ul>
          </nav>
          <p className="copyright pull-right">
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://www.falconconsulting.fr/"
              target="noopener noreferrer"
            >
              Falcon Consulting
            </a>
            , made with love for a better web
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
