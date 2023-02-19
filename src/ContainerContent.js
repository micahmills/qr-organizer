import { html } from 'lit';
import { map } from 'lit/directives/map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { GenericCard } from './genericCard.js';
import { db, doc, deleteDoc } from './firebaseConfig.js';

export class ContainerContent extends GenericCard {
  static get properties() {
    return {
      container: { type: Object },
      containerID: { type: String },
      containerContent: { type: Array },
    };
  }

  static get styles() {
    return [super.styles];
  }

  // eslint-disable-next-line class-methods-use-this
  async _deleteItem(id) {
    await deleteDoc(doc(db, 'Items', id));
    this.requestUpdate();
  }

  _renderContainerContent() {
    if (this.containerContent) {
      if (this.containerContent.length > 0) {
        return html`
          ${map(
            this.containerContent,
            item => html`<li id="${item.id}">
              ${item.name}
              <span class="actionButtonsContainer">
                <button
                  class=""
                  @click=${() => {
                    console.log('edit');
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-pencil-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"
                    />
                  </svg>
                </button>
                <button class="" @click=${() => this._deleteItem(item.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-trash3"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"
                    />
                  </svg>
                </button>
              </span>
            </li>`
          )}
        `;
      }
      return html`<li>No items in this container</li>`;
    }

    return html`<loading-spinner></loading-spinner>`;
  }

  _renderContainerLocation() {
    if (this.container.location) {
      return html`<h3>Location: ${this.container.location}</h3>`;
    }
    return html``;
  }

  render() {
    if (this.container) {
      return html`
        <h2>${ifDefined(this.container.labelName)} Content</h2>
        ${this._renderContainerLocation()}
        <ul>
          ${this._renderContainerContent()}
        </ul>
        <add-item containerID=${this.containerID}></add-item>
      `;
    }
    return html`<loading-spinner></loading-spinner>`;
  }
}
