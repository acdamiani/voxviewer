// Workaround for https://github.com/vitejs/vite/issues/9879
if (import.meta.env.PROD && typeof document === 'undefined') {
  Object.assign(globalThis, {
    document: {
      baseURI: self.location.href,
    },
  });
}
