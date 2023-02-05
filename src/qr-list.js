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
    };
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
        display: grid;
        grid-gap: 10px;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
      .QR_container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `;
  }

  constructor() {
    super();
    this.containers = [];
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

    containers.sort((a, b) => {
      const fa = a.labelName.toLowerCase();
      const fb = b.labelName.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });

    this.containers = containers;
  }

  render() {
    return html`
      ${map(
        this.containers,
        container => html`
          <div class="QR_container">
            <h1>${container.labelName}</h1>
            <qr-code
              data="${container.url}?c=${container.containerID}"
            ></qr-code>
          </div>
        `
      )}
    `;
  }
}
