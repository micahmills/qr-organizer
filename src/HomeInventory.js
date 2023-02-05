/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

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

export class HomeInventory extends LitElement {
  static get properties() {
    return {
      url: { type: String },
      containers: { type: Array },
      containerID: { type: String },
      container: { type: String },
      containerContent: { type: Array },
      title: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
        background-color: var(--home-inventory-background-color);
      }

      main {
        flex-grow: 1;
      }

      .logo {
        margin-top: 36px;
        animation: app-logo-spin infinite 20s linear;
      }

      @keyframes app-logo-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }
    `;
  }

  constructor() {
    super();
    this.getURLParams();
    this.addEventListener('itemAdded', e => {
      if (this.containerID === e.detail.container) {
        this._getContainerContent();
      }
    });

    this.title = 'Home Inventory';
    this.url = window.location.origin;
  }

  async _getContainerContent() {
    const containerRef = doc(db, 'Containers', this.containerID);
    const containerSnap = await getDoc(containerRef);

    if (containerSnap.exists()) {
      this.title = `Home Inventory - ${containerSnap.data().labelName}`;
      this.container = containerSnap.data();
      const contentsQuery = query(
        collection(db, 'Items'),
        where('container', '==', containerRef)
      );
      const contentsQuerySnapshot = await getDocs(contentsQuery);

      const containerContent = [];

      // gets the items with this container reference
      // eslint-disable-next-line no-shadow
      contentsQuerySnapshot.forEach(doc => {
        const item = doc.data();
        item.id = doc.id;
        containerContent.push(item);
      });
      this.containerContent = containerContent;
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
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
    this.containers = containers;
  }

  getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const container = params.get('c');

    if (container) {
      this.containerID = container;
      this._getContainerContent();
    }

    this._getContainers();
  }

  _renderQRCode() {
    if (this.containerID) {
      return html`<qr-code data="${this.url}?c=${this.containerID}"></qr-code>`;
    }
    return html`<p>Click on a container to view its QR code.</p>`;
  }

  render() {
    return html`
      <main>
        <h1>${this.title}</h1>
        ${this.containerID
          ? html`<container-content
              container=${ifDefined(JSON.stringify(this.container))}
              .containerContent=${this.containerContent}
              containerID=${this.containerID}
            ></container-content>`
          : html`<p>Click on a container to view its contents.</p>`}

        <container-list .containers=${this.containers}></container-list>

        ${this._renderQRCode()}
      </main>
    `;
  }
}
