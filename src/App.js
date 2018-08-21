import React, { Component } from 'react';
import './App.css';
import ChartPlot from './components/ChartPlot';
/* 
  This app is Roque Scramignon Samel's 
  answer to Intelie's challenge to the 
  admission process for the Full Stack 
  Developer vacancy.
*/
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
