export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type Reverser<T extends Record<any, any>> = {
  [P in keyof T as T[P]]: P;
};
