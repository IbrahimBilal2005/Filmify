// Polyfill for structuredClone if it's not available
if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (value) => JSON.parse(JSON.stringify(value));
}

import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}
