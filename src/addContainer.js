import { LitElement, html, css } from 'lit';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: 'AIzaSyD6xtWsMnxdZjLzlpUW1PVB3lxeDsS915E',
  authDomain: 'qr-organizer-14e12.firebaseapp.com',
  projectId: 'qr-organizer-14e12',
  storageBucket: 'qr-organizer-14e12.appspot.com',
  messagingSenderId: '737464270821',
  appId: '1:737464270821:web:68e8ef84ea775a4e1af90c',
};

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
    const name = this.renderRoot?.querySelector('input[name="name"]').value;
    const location = this.renderRoot?.querySelector(
      'input[name="location"]'
    ).value;

    const docRef = await addDoc(containersRef, {
      labelName: name,
      location,
    });

    const options = {
      detail: {
        container: docRef.id,
      },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('containerAdded', options));
  }

  render() {
    return html`
      <h2>Add Container</h2>
      <label for="name">Name</label>
      <input type="text" name="name" @input=${this._inputChanged} />
      <label for="location">Location</label>
      <input type="text" name="location" />
      <button ?disabled=${!this._submitEnabled} @click=${this._submitUpdate}>
        Add
      </button>
    `;
  }
}
