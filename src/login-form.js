import { LitElement, html, css } from 'lit';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig.js';

export class login extends LitElement {
  static get properties() {
    return {
      signedIn: { type: Boolean },
      signInError: { type: Boolean },
    };
  }

  static get styles() {
    return css`
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

        const options = {
          detail: {
            loggedIn: this.signedIn,
          },
          bubbles: true,
          composed: true,
        };
        this.dispatchEvent(new CustomEvent('login', options));
      } else {
        this.signedIn = false;
      }
    });
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

        const options = {
          detail: {
            loggedIn: this.signedIn,
          },
          bubbles: true,
          composed: true,
        };
        this.dispatchEvent(new CustomEvent('login', options));
      })
      .catch(error => {
        this.renderRoot.querySelector('input[name="username"]').value = '';
        this.renderRoot.querySelector('input[name="password"]').value = '';

        const errorCode = error.code;
        const errorMessage = error.message;
        // eslint-disable-next-line no-console
        console.log(errorCode, errorMessage);
        this.signedIn = false;
        this.signInError = true;
      });
  }

  _renderSigninError() {
    if (this.signInError) {
      return html`<span class="errormsg">Invalid Username or Password</span>`;
    }
    return html``;
  }

  render() {
    if (this.signedIn === undefined) {
      return html`<loading-spinner></loading-spinner></loading-spinner>`;
    }
    return html` <form class="loginForm" @submit=${e => e.preventDefault()}>
      ${this._renderSigninError()}
      <label for="username">Username</label>
      <input type="email" name="username" placeholder="Username" />
      <label for="password">Password</label>
      <input type="password" name="password" placeholder="Password" />
      <button class="button" @click=${() => this.signIn()}>Sign In</button>
    </form>`;
  }
}
