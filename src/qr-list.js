import { LitElement, html, css } from 'lit';
import { map } from 'lit/directives/map.js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const containersRef = collection(db, 'Containers');

export class QRList extends LitElement {
  static get properties() {
    return {
      containers: { type: Array },
      url: { type: String },
      labelWidth: { type: String },
      labelHeight: { type: String },
      hideName: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      main {
        font-family: sans-serif;
        display: grid;
        gap: 0px;
        grid-template-columns: repeat(2, minmax(283.5pt, 0fr));
      }
      .QR_container {
        border: 1px solid black;
        width: var(--label-height, 283.5pt);
        height: var(--label-width, 141.75pt);
      }
      h1 {
        margin: 0px;
        text-align: center;
        font-size: 1.4em;
        margin-top: 0.5em;
        max-height: 25%;
      }
      h1.hide {
        opacity: 0;
        max-height: 5%;
      }

      qr-code::part(svg) {
        max-height: 75%;
        width: 100%;
      }

      @media print {
        @page {
          margin: 2cm;
        }

        a {
          display: none;
        }
      }
    `;
  }

  constructor() {
    super();
    this.containers = [];
    this.url = window.location.origin;
    this.labelHeight = '283.5pt';
    this.labelWidth = '141.75pt';
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
                <h1 class="${this.hideName ? 'hide' : ''}">
                  ${container.labelName}
                </h1>
                <qr-code
                  data="${this.url}?c=${container.id}"
                  format="svg"
                ></qr-code>
              </div>
            `
        )}
      </main>
    `;
  }
}
