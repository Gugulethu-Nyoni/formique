// index.js
import { pulse } from './pulse.js';
import { reState } from './reState.js';
import { $effect } from './effect.js';
import { bind, bindText, bindAttr, bindClass } from './bind.js';

// Export the reactivity system
export { pulse as $state, pulse } from './pulse.js';
export { reState as $derived, reState } from './reState.js';
export { $effect } from './effect.js';

// Export the binding system
export { bind, bindText, bindAttr, bindClass };