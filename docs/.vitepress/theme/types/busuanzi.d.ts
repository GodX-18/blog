declare module 'busuanzi.pure.js' {
  function fetch(): void;
  const busuanzi: {
    fetch: typeof fetch
  };
  export default busuanzi;
} 