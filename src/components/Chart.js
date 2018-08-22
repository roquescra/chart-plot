import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

/* 
  This is the code that plotting 
  charts from a data array
*/
class Chart extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartsArray: this.props.chartsArray,
      currentPage: 1,
      chartsPerPage: 1
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  render(){
    const { chartsArray, currentPage, chartsPerPage } = this.state;

    // Logic for displaying current Charts
    const indexOfLastChart = currentPage * chartsPerPage;
    const indexOfFirstChart = indexOfLastChart - chartsPerPage;
    const currentCharts = chartsArray.slice(indexOfFirstChart, indexOfLastChart);

    const options = {
      legend:{
        display:true,
        position:'right',
        labels: {
          fontFamily: 'sans',
          usePointStyle: true
        }
      }
    };
    const charts = currentCharts.map(chartData => {
      return <Line data={chartData} options={options}
              key={this.state.chartsArray.indexOf(chartData)} />
    });

    // Logic for displaying charts buttons
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(chartsArray.length / chartsPerPage); i++) {
      pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      if (number != currentPage && 
          number < currentPage+4 && number > currentPage-4)
      return (
        <button className="App-Button" key={number} id={number}
        onClick={this.handleClick} 
        > {number}º Chart
        </button>
      );
    });

    return (
      <div className='App-Chart'>
      <ul>
        {charts}
      </ul>
      <ul id="page-numbers">
        {renderPageNumbers}
      </ul>
      </div>
    )
  }
}
export default Chart;