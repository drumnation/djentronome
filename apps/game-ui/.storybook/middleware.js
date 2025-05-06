// This is a custom middleware for Storybook that helps with dynamic imports
// It can be used to handle special cases or debug loading issues

module.exports = function expressMiddleware(router) {
  // Add headers to help prevent caching issues with dynamic imports
  router.use((req, res, next) => {
    // For any .stories.tsx files, ensure proper headers
    if (req.url.includes('.stories.tsx')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    next();
  });
}; 