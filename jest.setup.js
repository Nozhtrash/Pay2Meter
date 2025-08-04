// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// lucide-react publishes ES modules which Jest cannot parse without additional configuration.
// Mock the library so icons render as basic SVG elements during tests.
jest.mock('lucide-react', () => {
  const React = require('react');
  return new Proxy(
    {},
    {
      get: (target, prop) => (props) => React.createElement('svg', props),
    }
  );
});
