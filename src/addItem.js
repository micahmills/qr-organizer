import { LitElement, html, css } from 'lit';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc } from 'firebase/firestore/lite';

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
const itemsRef = collection(db, 'Items');

export class addItem extends LitElement {
  static get properties() {
    return {
      containerID: { type: String },
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
    console.log(this._submitEnabled);
  }

  async _submitUpdate() {
    const name = this.renderRoot?.querySelector('input[name="name"]').value;
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
  }

  render() {
    return html` <label
        >New Item Name:
        <input name="name" @input=${this._inputChanged} />
        <input name="containerID" .value=${this.containerID} hidden />
      </label>
      <button @click=${this._submitUpdate} .disabled=${!this._submitEnabled}>
        Submit
      </button>`;
  }
}
