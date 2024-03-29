import { LitElement, html, css } from 'lit';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore/lite';
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const containersRef = collection(db, 'Containers');

export class addContainer extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      _submitEnabled: { state: true },
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }

      label {
        margin-top: 1em;
        font-size: 1.25rem;
      }

      /* button {
        margin: 1em;
        padding: 1.25em;
      } */

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
        margin: 1em;
      }

      input {
        background-color: var(--white);
        border: 1px solid var(--color-dark);
        border-radius: 0.5rem;
        padding: 0.5rem;
        line-height: 1.5rem;
        font-size: 1.15em;
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
    const locationField = this.renderRoot?.querySelector(
      'input[name="location"]'
    );
    const location = locationField.value.trim();

    const docRef = await addDoc(containersRef, {
      labelName: name,
      location,
      active: true,
    });

    const options = {
      detail: {
        container: docRef.id,
      },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('containerAdded', options));
    nameField.value = '';
    locationField.value = '';
  }

  render() {
    return html`
      <label for="name">Name</label>
      <input type="text" name="name" @input=${this._inputChanged} />
      <label for="location">Location</label>
      <input type="text" name="location" />
      <button
        class="button"
        ?disabled=${!this._submitEnabled}
        @click=${this._submitUpdate}
      >
        Add Container
      </button>
    `;
  }
}
