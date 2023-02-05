/* eslint-disable import/no-extraneous-dependencies */
import 'webcomponent-qr-code';
import { HomeInventory } from './HomeInventory.js';
import { ContainerList } from './ContainerList.js';
import { ContainerContent } from './ContainerContent.js';
import { addItem } from './addItem.js';
import { addContainer } from './addContainer.js';

customElements.define('home-inventory', HomeInventory);
customElements.define('container-list', ContainerList);
customElements.define('container-content', ContainerContent);
customElements.define('add-item', addItem);
customElements.define('add-container', addContainer);
