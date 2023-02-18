import { LitElement, html, css } from 'lit';
import { auth } from './firebaseConfig.js';

export class logoutButton extends LitElement {
  static get properties() {
    return {
      signedIn: { type: Boolean },
    };
  }

  static get styles() {
    return css`
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
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
      }
      .button svg {
        fill: var(--white);
        width: 1.5rem;
        height: 1.5rem;
      }
    `;
  }

  constructor() {
    super();
    this.addEventListener('login', e => {
      if (e.detail.loggedIn === true) {
        this.signedIn = true;
      }
      if (e.detail.loggedIn === false) {
        this.signedIn = false;
      }
    });
  }

  async _signOut() {
    await auth.signOut();
    this.signedIn = false;

    const options = {
      detail: {
        loggedIn: this.signedIn,
      },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('login', options));
  }

  render() {
    console.log(this.signedIn);
    if (this.signedIn) {
      return html`
        <button @click=${this._signOut} class="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 512 512"
          >
            <!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
            />
          </svg>
        </button>
      `;
    }
    return html``;
  }
}
