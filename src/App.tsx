import React from 'react';
import logo from './assets/logo.svg';
import './App.css';
import UploadFile from "./components/UploadFileComponent";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <UploadFile />
      </header>
    </div>
  );
}

export default App;
