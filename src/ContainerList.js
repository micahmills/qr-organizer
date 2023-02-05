import { LitElement, html, css } from 'lit';
import { map } from 'lit/directives/map.js';

// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore/lite';

export class ContainerList extends LitElement {
  static get properties() {
    return {
      containers: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }
      ul {
        list-style: none;
      }
    `;
  }

  render() {
    if (this.containers) {
      return html`
        <h2>Containers</h2>
        <ul>
          ${map(
            this.containers,
            container => html`<li>
              <a href="/?c=${container.id}"> ${container.labelName} </a>
            </li>`
          )}
        </ul>
      `;
    }
    return html`<h2>Loading...</h2>`;
  }
}
