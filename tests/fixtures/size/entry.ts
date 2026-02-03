import { type Foo } from './types.js';
export { type Bar } from './types.js';

export const value = 1;

export const useFoo = (foo: Foo): string => foo.name;
