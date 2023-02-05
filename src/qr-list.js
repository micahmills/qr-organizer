import { LitElement, html, css } from 'lit';
import { map } from 'lit/directives/map.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration
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

export class QRList extends LitElement {
  static get properties() {
    return {
      containers: { type: Array },
      url: { type: String },
    };
  }

  static get styles() {
    return css`
      main {
        font-family: sans-serif;
        display: grid;
        grid-gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
      .QR_container {
        border: 2px dotted black;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      h1 {
        margin: 0;
      }
    `;
  }

  constructor() {
    super();
    this.containers = [];
    this.url = window.location.origin;
  }

  connectedCallback() {
    super.connectedCallback();
    this._getContainers();
  }

  async _getContainers() {
    const containers = [];
    const querySnapshot = await getDocs(containersRef);
    // eslint-disable-next-line no-shadow
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      const container = doc.data();
      container.id = doc.id;
      containers.push(container);
    });

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base',
    });
    const sorted = containers.sort((b, a) =>
      collator.compare(b.labelName, a.labelName)
    );

    this.containers = sorted;
  }

  render() {
    return html`
      <a href="/">Home</a>
      <main>
        ${map(
          this.containers,
          container =>
            html`
              <div class="QR_container">
                <h1>${container.labelName}</h1>
                <qr-code data="${this.url}?c=${container.id}"></qr-code>
              </div>
            `
        )}
      </main>
    `;
  }
}
