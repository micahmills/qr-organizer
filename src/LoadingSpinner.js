import { LitElement, html, css } from 'lit';

export class LoadingSpinner extends LitElement {
  static get properties() {
    return {
      loading: { type: Boolean },
    };
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        font-size: 0.625rem;
      }

      .ball {
        width: 1em;
        height: 1em;
        margin: 1em auto;
        border-radius: 50px;
      }

      .ball:nth-child(1) {
        background: var(--color-light);
        -webkit-animation: right 1s infinite ease-in-out;
        -moz-animation: right 1s infinite ease-in-out;
        animation: right 1s infinite ease-in-out;
      }

      .ball:nth-child(2) {
        background: var(--color-mid-light);
        -webkit-animation: left 1.1s infinite ease-in-out;
        -moz-animation: left 1.1s infinite ease-in-out;
        animation: left 1.1s infinite ease-in-out;
      }

      .ball:nth-child(3) {
        background: var(--color-primary);
        -webkit-animation: right 1.05s infinite ease-in-out;
        -moz-animation: right 1.05s infinite ease-in-out;
        animation: right 1.05s infinite ease-in-out;
      }

      .ball:nth-child(4) {
        background: var(--color-mid-dark);
        -webkit-animation: left 1.15s infinite ease-in-out;
        -moz-animation: left 1.15s infinite ease-in-out;
        animation: left 1.15s infinite ease-in-out;
      }

      .ball:nth-child(5) {
        background: var(--color-dark);
        -webkit-animation: right 1.1s infinite ease-in-out;
        -moz-animation: right 1.1s infinite ease-in-out;
        animation: right 1.1s infinite ease-in-out;
      }

      /* .ball:nth-child(6) {
        background: var(--loading-ball-color, var(--color-mid-light));
        -webkit-animation: left 1.05s infinite ease-in-out;
        -moz-animation: left 1.05s infinite ease-in-out;
        animation: left 1.05s infinite ease-in-out;
      }

      .ball:nth-child(7) {
        background: var(--loading-ball-color, var(--color-mid-light));
        -webkit-animation: right 1s infinite ease-in-out;
        -moz-animation: right 1s infinite ease-in-out;
        animation: right 1s infinite ease-in-out;
      } */

      @-webkit-keyframes right {
        0% {
          -webkit-transform: translate(-1.5em);
        }
        50% {
          -webkit-transform: translate(1.5em);
        }
        100% {
          -webkit-transform: translate(-1.5em);
        }
      }

      @-webkit-keyframes left {
        0% {
          -webkit-transform: translate(1.5em);
        }
        50% {
          -webkit-transform: translate(-1.5em);
        }
        100% {
          -webkit-transform: translate(1.5em);
        }
      }

      @-moz-keyframes right {
        0% {
          -moz-transform: translate(-1.5em);
        }
        50% {
          -moz-transform: translate(1.5em);
        }
        100% {
          -moz-transform: translate(-1.5em);
        }
      }

      @-moz-keyframes left {
        0% {
          -moz-transform: translate(1.5em);
        }
        50% {
          -moz-transform: translate(-1.5em);
        }
        100% {
          -moz-transform: translate(1.5em);
        }
      }

      @keyframes right {
        0% {
          transform: translate(-1.5em);
        }
        50% {
          transform: translate(1.5em);
        }
        100% {
          transform: translate(-1.5em);
        }
      }

      @keyframes left {
        0% {
          transform: translate(1.5em);
        }
        50% {
          transform: translate(-1.5em);
        }
        100% {
          transform: translate(1.5em);
        }
      }
    `;
  }

  render() {
    return html`
      <div class="container">
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
        <div class="ball"></div>
      </div>
    `;
  }
}
