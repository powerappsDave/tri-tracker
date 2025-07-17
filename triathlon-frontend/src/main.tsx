import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Login from './Login.tsx'

/*const App = () => {
  // Simulating the loginDetails state (you can modify this as needed)
  const loginDetails = { email: '', password: '' };

  return <Login loginDetails={loginDetails} />;
}; */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);