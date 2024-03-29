import { html } from 'lit';
import { map } from 'lit/directives/map.js';
import { GenericCard } from './genericCard.js';

export class ContainerList extends GenericCard {
  static get properties() {
    return {
      containers: { type: Array },
      addVisible: { type: Boolean },
      listVisible: { type: Boolean },
    };
  }

  static get styles() {
    return [super.styles];
  }

  render() {
    if (this.containers) {
      if (this.listVisible) {
        return html`
          <h2>${this.title}</h2>
          <ul>
            ${map(this.containers, container => {
              if (container.empty === false || container.empty === undefined) {
                return html`<li>
                  <a href="/?c=${container.id}"> ${container.labelName} </a>
                </li>`;
              }
              return html``;
            })}
          </ul>
          <details>
            <summary>Empty Containers</summary>
            <ul>
              ${map(this.containers, container => {
                if (container.empty === true) {
                  return html`<li>
                    <a href="/?c=${container.id}" class="empty">
                      ${container.labelName}
                    </a>
                  </li>`;
                }
                return html``;
              })}
            </ul>
          </details>
          ${this.addVisible
            ? html`<add-container></add-container>`
            : html`<button
                class="button"
                @click=${() => {
                  this.addVisible = true;
                }}
              >
                Add Container
              </button>`}
        `;
      }
      return html`<button
        class="button"
        @click=${() => {
          this.listVisible = true;
        }}
      >
        Show Containers
      </button>`;
    }
    return html`<loading-spinner></loading-spinner>`;
  }
}
