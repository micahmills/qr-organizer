import { LitElement, html, css } from 'lit';
import { map } from 'lit/directives/map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export class ContainerContent extends LitElement {
  static get properties() {
    return {
      container: { type: Object },
      containerID: { type: String },
      containerContent: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
        border-radius: 1rem;
        padding: 1em;
      }

      h2,
      h3 {
        margin: 0.5rem 0;
      }

      ul {
        list-style: none;
      }
    `;
  }

  _renderContainerContent() {
    if (this.containerContent) {
      if (this.containerContent.length > 0) {
        return html`
          ${map(
            this.containerContent,
            item => html`<li id="${item.id}">${item.name}</li>`
          )}
        `;
      }
      return html`<li>No items in this container</li>`;
    }

    return html`<li>Loading...</li>`;
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
    return html`<h2>Loading...</h2>`;
  }
}
