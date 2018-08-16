import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

class Chart extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartsArray: this.props.chartsArray,
      chartData: this.props.chartsArray,
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
      },
      scales: {
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
        }, {
          id: 'B',
          type: 'linear',
          position: 'right',
          ticks: {
            max: 1,
            min: 0
          }
        }]
      }
    };
    return (
      <div className='App-Chart'>
        <Line data={this.props.chartData} options={options} />
      </div>
    )
  }
}
export default Chart;