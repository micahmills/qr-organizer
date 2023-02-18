/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, html, css } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, containersRef, itemsRef } from './firebaseConfig.js';

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
        color: var(--color-dark);
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
        background-color: var(--gray);
      }

      main {
        flex-grow: 1;
      }

      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
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

      .button svg {
        fill: var(--white);
        width: 1.5rem;
        height: 1.5rem;
      }

      .loginForm {
        display: flex;
        flex-direction: column;
        width: 50vw;
        min-width: 20rem;
        margin: 25vh auto;
        background-color: var(--white);
        border-radius: 0.5rem;
        padding: 1rem;
      }

      .loginForm label {
        text-align: left;
        margin: 1rem 0.25em 0;
      }

      .loginForm input {
        margin: 0.5rem 0px 1rem;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid black;
        font-size: 1rem;
      }

      .loginForm button {
        padding: 1rem;
        margin: 1.5rem 0;
      }

      .errormsg {
        color: var(--color-error);
      }

      .helpText {
        font-size: 1rem;
      }
    `;
  }

  constructor() {
    super();
    if (this.signedIn === undefined) {
      this.signedIn = false;
    } else {
      this.signedIn = true;
    }

    this.getURLParams();
    this.addEventListener('login', e => {
      console.log(e.detail);
      if (e.detail.loggedIn === true) {
        this.signedIn = true;
      }
      if (e.detail.loggedIn === false) {
        this.signedIn = false;
      }
    });

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

  _clearSearchResults() {
    this.searchResults = '';
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
      return html`<login-form></login-form>`;
    }
    if (!this.signedIn) {
      return html`Loading...`;
    }

    if (this.searchResults) {
      return html`
        <main>
          <h1>${this.title}</h1>
          <logout-button signedIn></logout-button>
          <section class="header">
            <button @click=${this._clearSearchResults} class="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                class="bi bi-arrow-left-short"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
                />
              </svg>
            </button>
            <search-items></search-items>
          </section>
          <search-results .searchResults=${this.searchResults}></search-results>
        </main>
      `;
    }
    return html`
      <main>
        <h1>${this.title}</h1>
        <logout-button signedIn></logout-button>
        <section class="header">
          <a href="/print.html" class="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-printer"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
              <path
                d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"
              />
            </svg>
          </a>
          <search-items></search-items>
        </section>
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
