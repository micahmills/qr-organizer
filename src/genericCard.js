import { LitElement, css } from 'lit';

export class GenericCard extends LitElement {
  static get properties() {
    return {
      title: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        border-radius: 0.5rem;
        box-shadow: 0 6px 10px hsla(200, 75%, 8%, 0.08),
          0 0 6px hsla(200, 75%, 8%, 0.05);
        padding: 1em;
        margin: 1em 0;
        background: var(--white);
      }
      h2 {
        margin: 0;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      li {
        list-style: none;
        margin: 0;
      }
      li a {
        text-decoration: none;
        line-height: 1.5em;
        background-color: var(--color-primary);
        border: none;
        border-radius: 0.5rem;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        font-size: 1.25rem;
        color: var(--white);
        margin: 1.5rem 0;
      }

      .card {
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.08), 0 0 6px rgba(0, 0, 0, 0.05);
        transition: 0.3s transform cubic-bezier(0.155, 1.105, 0.295, 1.12),
          0.3s box-shadow,
          0.3s -webkit-transform cubic-bezier(0.155, 1.105, 0.295, 1.12);
        padding: 14px 80px 18px 36px;
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
    `;
  }
}
