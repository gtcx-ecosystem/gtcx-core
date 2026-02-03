import type { Domain, Control } from './types';
import { CORE12_DOMAINS } from './domains';
export type { Control, Domain, FrameworkMapping } from './types';
export { CORE12_DOMAINS };
export declare function getDomain(domainId: string): Domain | undefined;
export declare function getControl(controlId: string): Control | undefined;
export declare function getAllControls(): Control[];
export declare function getControlCount(): number;
//# sourceMappingURL=schema.d.ts.map