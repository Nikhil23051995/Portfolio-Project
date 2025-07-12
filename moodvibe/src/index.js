import React from 'react'; // Import React for building UI components
import ReactDOM from 'react-dom/client'; // Import ReactDOM for rendering the app
import { Provider } from 'react-redux'; // Import Provider to connect Redux store to React
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for client-side routing
import store from './redux/store'; // Import the Redux store
import App from './App'; // Import the main App component
import './index.css'; // Import global CSS styles

// Create a root element for rendering the app
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the app, wrapping it with Provider for Redux and BrowserRouter for routing
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
