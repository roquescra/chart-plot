import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

class Chart extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartsArray: this.props.chartsArray,
      chartData: this.props.chartData,
    }
  }
  render(){
    var options = {
      legend:{
        display:true,
        position:'right',
        labels: {
          fontFamily: 'sans',
          usePointStyle: true
        }
      }
    };
    const charts = this.state.chartsArray.map(chartData => (
      <Line data={chartData} key={this.state.chartsArray.indexOf(chartData)} options={options} />
    ));
    return (
      <div className='App-Chart'>
        {charts}
      </div>
    )
  }
}
export default Chart;