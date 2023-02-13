/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit';

export class SearchResults extends LitElement {
  static get properties() {
    return {
      searchResults: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
      }
      li {
        list-style: none;
        margin: 0;
      }
    `;
  }

  render() {
    if (this.searchResults.length === 0) {
      return html`<ul>
        <li>No Results Found</li>
      </ul>`;
    }

    return html`
      <ul>
        ${this.searchResults.map(
          item => html`<li>${item.name} in ${item.containerName}</li>`
        )}
      </ul>
    `;
  }
}
