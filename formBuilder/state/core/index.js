// index.js
import { pulse } from './pulse.js';
import { reState } from './reState.js';
import { $effect } from './effect.js';
import { bind, bindText, bindAttr, bindClass } from './bind.js';

// Export the reactivity system
// Core primitives (direct named exports)
export { pulse as $state } from './pulse.js';
export { reState as $derived } from './reState.js';
export { $effect } from './effect.js';

// Binding utilities (grouped under `state`)
export const state = {
  bind,
  text: bindText,   // Consistent naming
  attr: bindAttr,
  class: bindClass,
};

// Optional: Re-export bind utilities directly for power users
export { bind, bindText, bindAttr, bindClass };