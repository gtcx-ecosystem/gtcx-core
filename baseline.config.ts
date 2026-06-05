export default {
  knowledge: {
    paths: ['01-docs/'],
    exclude: [
      '01-docs/05-audit/_historical/**',
      '01-docs/archive/**',
      '01-docs/templates/**',
      '_archive/**',
      '_delete/**',
      '**/node_modules/**',
      '**/dist/**',
    ],
    format: 'markdown',
  },
};
