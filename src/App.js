import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';

function App() {
  const test = fetch('./Lab1_CSV/Station Inventory EN.csv');
  return (
    <div className="App">
      <Header />
      <div className="main-content">
        <Content />
      </div>
      <Footer />
    </div>
  );
}

export default App;
