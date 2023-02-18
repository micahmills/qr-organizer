import { LitElement, html, css } from 'lit';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const itemsRef = collection(db, 'Items');

export class addItem extends LitElement {
  static get properties() {
    return {
      containerID: { type: String },
      name: { type: String },
      _submitEnabled: { state: true },
      addVisible: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
        display: flex;
        justify-content: center;
      }

      .button {
        background-color: var(--color-light);
        border: none;
        border-radius: 0.5rem;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        font-size: 1rem;
        color: var(--white);
      }

      input {
        background-color: var(--white);
        border: 1px solid var(--color-dark);
        border-radius: 0.5rem;
        padding: 0.5rem;
        line-height: 1.5rem;
        font-size: 1.15em;
        margin-inline-end: 1rem;
      }
    `;
  }

  constructor() {
    super();
    this._submitEnabled = false;
  }

  _inputChanged(e) {
    this._submitEnabled = !!e.target.value;
  }

  async _submitUpdate() {
    const nameField = this.renderRoot?.querySelector('input[name="name"]');
    const name = nameField.value.trim();
    const containerRef = doc(db, 'Containers', this.containerID);

    await addDoc(itemsRef, {
      name,
      container: containerRef,
    });

    const options = {
      detail: {
        container: this.containerID,
      },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('itemAdded', options));
    this._submitEnabled = false;
    nameField.value = '';
  }

  render() {
    if (!this.addVisible) {
      return html`<button
        class="button"
        @click=${() => {
          this.addVisible = true;
        }}
      >
        Add Items
      </button>`;
    }
    return html` <label>
        New Item Name:
        <input name="name" @input=${this._inputChanged} />
        <input name="containerID" .value=${this.containerID} hidden />
      </label>
      <button
        class="button"
        @click=${this._submitUpdate}
        .disabled=${!this._submitEnabled}
      >
        Add Item
      </button>`;
  }
}
