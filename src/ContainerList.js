import { LitElement, html, css } from 'lit';
import { map } from 'lit/directives/map.js';

// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore/lite';

export class ContainerList extends LitElement {
  static get properties() {
    return {
      containers: { type: Array },
      addVisible: { type: Boolean },
      listVisible: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
        border-radius: 1rem;
        padding: 1em;
        margin: 1em 0;
      }
      ul {
        list-style: none;
        padding: 0;
      }
    `;
  }

  render() {
    if (this.containers) {
      if (this.listVisible) {
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
          ${this.addVisible
            ? html`<add-container></add-container>`
            : html`<button
                @click=${() => {
                  this.addVisible = true;
                }}
              >
                Add Container
              </button>`}
        `;
      }
      return html`<button
        @click=${() => {
          this.listVisible = true;
        }}
      >
        Show Containers
      </button>`;
    }
    return html`<h2>Loading...</h2>`;
  }
}
