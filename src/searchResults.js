/* eslint-disable class-methods-use-this */
import { html } from 'lit';
import { GenericCard } from './genericCard.js';

export class SearchResults extends GenericCard {
  static get properties() {
    return {
      searchResults: { type: Array },
    };
  }

  static get styles() {
    return [super.styles];
  }

  render() {
    if (this.searchResults.length === 0) {
      return html` <h2>${this.title}</h2>
        <ul>
          <li>No Results Found</li>
        </ul>`;
    }

    return html`
      <h2>${this.title}</h2>
      <ul>
        ${this.searchResults.map(
          item => html`<li>${item.name} in ${item.containerName}</li>`
        )}
      </ul>
    `;
  }
}
