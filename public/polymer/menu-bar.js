import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

// Create your custom component
class MenuBar extends LitElement {
    // Declare properties
    static get properties() {
        return {
            name: { type: String }
        };
    }
    // Initialize properties
    constructor() {
        super();
        this.name = 'World';
    }
render() {
        return html`
              <style>
                :host {
                  font-family: sans-serif;
                }
                ul {
                  list-style-type: none;
                  margin: 0;
                  padding: 0;
                  overflow: hidden;
                  background-color: #FFBD54;
                }

                li {
                  float: left;
                }

                li a, .dropbtn {
                  display: inline-block;
                  color: black;
                  text-align: center;
                  padding: 14px 16px;
                  text-decoration: none;
                }

                li a:hover, .dropdown:hover .dropbtn {
                  background-color: red;
                }

                li.dropdown {
                  display: inline-block;
                }

                .dropdown-content {
                  display: none;
                  position: absolute;
                  background-color: #f9f9f9;
                  min-width: 160px;
                  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                  z-index: 1;
                }

                .dropdown-content a {
                  color: black;
                  padding: 12px 16px;
                  text-decoration: none;
                  display: block;
                  text-align: left;
                }

                .dropdown-content a:hover {background-color: #f1f1f1}

                .dropdown:hover .dropdown-content {
                  display: block;
                }

                .img_style_logo{
                  height: 40px;
                  width: 40px;
                  padding-bottom: -5px
                }

              </style>

              <!-- shadow DOM goes here -->
              <ul>
                <li><a href="/">Shogi</a></li>
                <li class="dropdown">
                  <a href="#" class="dropbtn">Game</a>
                  <div class="dropdown-content">
                    <a href="/new">New</a>
                    <a href="/empty">Empty</a>
                    <a href="/save">Save</a>
                    <a href="/load">Load</a>
                    <a href="/about">About</a>
                  </div>
                </li>
                <li class="dropdown">
                  <a href="#" class="dropbtn">Edit</a>
                  <div class="dropdown-content">
                    <a href="/undo">Undo</a>
                    <a href="/redo">Redo</a>
                  </div>
                </li>
                <li><a href="/SimuToJson">Simulation</a></li>
              </ul>
            `;
    }
}
customElements.define('menu-bar', MenuBar);
