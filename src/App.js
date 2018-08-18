import React, { Component } from 'react';
import './App.css';
import ChartPlot from './components/ChartPlot';

class App extends Component{
  render() {
    return (
      <div className="App ">
        <div className="App-header">
          <h1 className="App-title">Roque's Challenge</h1>
        </div>
          <ChartPlot />
      </div>  
    );
  }
}
export default App;
