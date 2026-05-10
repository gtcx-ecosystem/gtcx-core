export default {
  knowledge: {
    paths: ['docs/'],
    exclude: [
      'docs/audit/_historical/**',
      'docs/archive/**',
      'docs/templates/**',
      '_archive/**',
      '_delete/**',
      '**/node_modules/**',
      '**/dist/**',
    ],
    format: 'markdown',
  },
};
