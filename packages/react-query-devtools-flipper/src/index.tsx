const noop: any = () => {};

export let useFlipperDevtools: typeof import('./useFlipperDevtools').default;

if (process.env.NODE_ENV !== 'production') {
  useFlipperDevtools = require('./useFlipperDevtools').default;
} else {
  useFlipperDevtools = noop;
}
