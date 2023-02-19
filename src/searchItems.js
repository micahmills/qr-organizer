import { LitElement, html, css } from 'lit';

export class SearchItems extends LitElement {
  static get properties() {
    return {
      searchTerm: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
      }

      .form-control {
        background-color: var(--white);
        border: 1px solid var(--color-dark);
        border-radius: 0.5rem;
      }

      .form-control:has(> input:focus) {
        border-color: var(--color-light);
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px var(color-light);
        outline: 0 none;
      }

      .form-control input {
        border: none;
        padding: 0.5rem;
        line-height: 1.5rem;
        font-size: 1.15em;
        border-radius: 0.5rem;
      }

      .form-control input:focus {
        outline: none;
      }

      .form-control button {
        background: var(--white);
        border: 0;
        border-radius: 0 0.5rem 0.5rem 0;
        border-inline-start: 1px solid var(--gray-dark);
        outline: 0;
        height: 1.5rem;
        min-width: 2rem;
    `;
  }

  async _search() {
    const searchField = this.renderRoot?.querySelector('input[name="search"]');
    if (!searchField) {
      return;
    }
    const searchTerm = searchField.value.trim();

    const options = {
      detail: {
        search: searchTerm,
      },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('search', options));
    searchField.value = '';
  }

  render() {
    return html`
      <div class="form-control">
        <input
          type="text"
          name="search"
          @input=${e => {
            this.searchTerm = e.target.value;
          }}
          @keydown=${e => {
            if (e.key === 'Enter') {
              this._search();
            }
          }}
        />

        <button @click=${() => this._search()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
            ></path>
          </svg>
        </button>
      </div>
    `;
  }
}
