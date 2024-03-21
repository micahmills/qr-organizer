import { LitElement, html, css } from 'lit';
import { map } from 'lit/directives/map.js';
import { classMap } from 'lit/directives/class-map.js';
import { getDocs } from 'firebase/firestore';
import { containersRef, infoRef } from './firebaseConfig.js';

export class QRList extends LitElement {
  static get properties() {
    return {
      containers: { type: Array },
      url: { type: String },
      labelWidth: { type: String },
      labelHeight: { type: String },
      hideName: { type: Boolean },
      hiddenLabels: { type: Array },
      labelAddress: { type: String },
      labelCity: { type: String },
      labelState: { type: String },
      labelZip: { type: String },
      labelCountry: { type: String },
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
        width: var(--label-height, 255pt);
        height: var(--label-width, 153pt);
        position: relative;
        page-break-inside: avoid;
      }
      .container {
        display: flex;
      }

      .address {
        padding-inline-start: 0.5em;
        padding-block-start: 0.5em;
        flex: 3;
        font-size: 1.4em;
      }
      qr-code {
        flex: 1;
      }
      .add_name {
        line-height: 1em;
      }
      h1 {
        margin: 0px;
        text-align: center;
        font-size: 1.4em;
        margin-top: 0.5em;
        max-height: 25%;
      }
      h1.hide {
        opacity: 0.25;
        max-height: 5%;
      }
      label.hide_checkbox {
        position: absolute;
        bottom: 1em;
        left: 1em;
      }

      .hide {
        opacity: 0.25;
      }

      qr-code::part(svg) {
        max-height: 100%;
        width: 100%;
      }

      .button {
        background-color: var(--color-light);
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-size: 1rem;
        color: var(--white);
        margin: 1em;
        display: inline-block;
      }

      @media print {
        @page {
          margin: 2cm;
        }

        a {
          display: none;
        }
        .hide {
          opacity: 0 !important;
          display: none;
        }
        input[type='checkbox'] {
          display: none;
        }
        label.hide_checkbox {
          display: none;
        }
      }
    `;
  }

  constructor() {
    super();
    this.containers = [];
    this.hiddenLabels = [];
    this.url = window.location.origin;
    this.labelHeight = '153pt';
    this.labelWidth = '255pt';
  }

  connectedCallback() {
    super.connectedCallback();
    this._getContainers();
    this._getAddress();
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

  async _getAddress() {
    const querySnapshot = await getDocs(infoRef);
    querySnapshot.forEach(doc => {
      if (doc.id === 'Address') {
        this.labelAddress = doc.data().label_address;
        this.labelCity = doc.data().label_city;
        this.labelState = doc.data().label_state;
        this.labelZip = doc.data().label_zip;
        this.labelCountry = doc.data().label_country;
      }
    });
  }

  _hideLabel(e) {
    if (e.target.checked) {
      this.hiddenLabels = [...this.hiddenLabels, e.target.id];
    } else {
      const index = this.hiddenLabels.indexOf(e.target.id);
      if (index > -1) {
        this.hiddenLabels.splice(index, 1);
      }
    }
    this.requestUpdate();
  }

  render() {
    return html`
      <a href="/" class="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-house-door"
          viewBox="0 0 16 16"
        >
          <path
            d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146ZM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5Z"
          />
        </svg>
      </a>
      <main>
        ${map(this.containers, container => {
          const hidden = this.hiddenLabels.includes(container.id);
          const classes = { hide: hidden, QR_container: true };
          return html`
            <div class=${classMap(classes)}>
              <h1 class="${this.hideName ? 'hide' : ''}">
                ${container.labelName}
              </h1>
              <h1 class="add_name">Micah & Kara Mills</h1>
              <div class="container">
                <div class="address">
                  ${this.labelAddress}</br>
                  ${this.labelCity}, ${this.labelState} ${this.labelZip}</br>
                  ${this.labelCountry}
                </div>
                <label class="hide_checkbox" for=${container.id}
                  >${hidden ? 'Show' : 'Hide'}
                  <input
                    type="checkbox"
                    @click=${this._hideLabel}
                    id=${container.id}
                /></label>
                <qr-code
                  data="${this.url}?c=${container.id}"
                  format="svg"
                ></qr-code>
              </div>
            </div>
          `;
        })}
      </main>
    `;
  }
}
