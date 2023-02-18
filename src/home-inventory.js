/* eslint-disable import/no-extraneous-dependencies */
import 'webcomponent-qr-code';
import { HomeInventory } from './HomeInventory.js';
import { login } from './login-form.js';
import { logoutButton } from './logout-button.js';
import { ContainerList } from './ContainerList.js';
import { ContainerContent } from './ContainerContent.js';
import { addItem } from './addItem.js';
import { addContainer } from './addContainer.js';
import { QRList } from './qr-list.js';
import { SearchItems } from './searchItems.js';
import { SearchResults } from './searchResults.js';

customElements.define('home-inventory', HomeInventory);
customElements.define('login-form', login);
customElements.define('logout-button', logoutButton);
customElements.define('container-list', ContainerList);
customElements.define('container-content', ContainerContent);
customElements.define('add-item', addItem);
customElements.define('add-container', addContainer);

customElements.define('qr-list', QRList);
customElements.define('search-items', SearchItems);
customElements.define('search-results', SearchResults);
