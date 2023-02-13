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
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

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
const itemsRef = collection(db, 'Items');
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export class HomeInventory extends LitElement {
  static get properties() {
    return {
      url: { type: String },
      containers: { type: Array },
      containerID: { type: String },
      container: { type: String },
      containerContent: { type: Array },
      title: { type: String },
      _search: { type: String },
      searchResults: { type: Array },
      signedIn: { type: Boolean },
      signInError: { type: String },
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

      .helpText {
        font-size: 1rem;
      }
    `;
  }

  constructor() {
    super();
    onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // const uid = user.uid;
        this.signedIn = true;
        // ...
      } else {
        this.signedIn = false;
      }
    });

    this.getURLParams();
    this.addEventListener('itemAdded', e => {
      if (this.containerID === e.detail.container) {
        this._getContainerContent();
      }
    });
    this.addEventListener('containerAdded', () => {
      this._getContainers();
    });
    this.addEventListener('search', e => {
      this._search = e.detail.search;
      this._getSearchResults();
    });

    this.title = 'Home Inventory';
    this.url = window.location.origin;
  }

  signIn() {
    const username = this.renderRoot?.querySelector(
      'input[name="username"]'
    )?.value;
    const password = this.renderRoot?.querySelector(
      'input[name="password"]'
    )?.value;

    signInWithEmailAndPassword(auth, username, password)
      .then(() => {
        this.signedIn = true;
      })
      .catch(error => {
        this.renderRoot.querySelector('input[name="username"]').value = '';
        this.renderRoot.querySelector('input[name="password"]').value = '';

        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        this.signedIn = false;
        this.signInError = true;
      });
  }

  _renderSigninError() {
    if (this.signInError) {
      return html`<span>Invalid Username or Password</span>`;
    }
    return html``;
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

      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base',
      });
      const sorted = containerContent.sort((b, a) =>
        collator.compare(b.name, a.name)
      );

      this.containerContent = sorted;
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

  async _getSearchResults() {
    const searchResults = [];
    const querySnapshot = await getDocs(itemsRef);
    // eslint-disable-next-line no-shadow
    querySnapshot.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      const container = doc.data();
      container.id = doc.id;
      searchResults.push(container);
    });

    const filtered = searchResults.filter(
      container =>
        JSON.stringify(container)
          .toLowerCase()
          .indexOf(this._search.toLowerCase()) !== -1
    );

    for (const item of filtered) {
      // eslint-disable-next-line no-await-in-loop
      const containerName = await this._getContainerName(item.container);
      item.containerName = containerName;
    }

    this.searchResults = filtered;
  }

  // eslint-disable-next-line class-methods-use-this
  async _getContainerName(containerRef) {
    const docSnap = await getDoc(containerRef);
    if (docSnap.exists()) {
      const { labelName } = docSnap.data();
      return labelName;
    }
    return 'Unknown';
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
    return html`<p class="helpText">
      Click on a container to view its QR code.
    </p>`;
  }

  render() {
    if (this.signedIn === false) {
      return html` ${this._renderSigninError()}
        <input type="email" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <button
          @click=${() =>
            this.signIn('micahmills@gmail.com', '23itfyaDESiCA-qr')}
        >
          Sign In
        </button>`;
    }
    if (this.searchResults) {
      return html`
        <main>
          <h1>${this.title}</h1>
          <search-items></search-items>
          <search-results .searchResults=${this.searchResults}></search-results>
        </main>
      `;
    }
    return html`
      <main>
        <h1>${this.title}</h1>
        <a href="/print.html">Print Labels</a>
        <search-items></search-items>
        ${this.containerID
          ? html`<container-content
              container=${ifDefined(JSON.stringify(this.container))}
              .containerContent=${this.containerContent}
              containerID=${this.containerID}
            ></container-content>`
          : html`<p>Click on a container to view its contents.</p>`}

        <container-list
          .containers=${this.containers}
          ?listVisible=${!this.containerID}
        ></container-list>

        ${this._renderQRCode()}
      </main>
    `;
  }
}
