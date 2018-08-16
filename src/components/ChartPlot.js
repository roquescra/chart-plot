import React, {Component} from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import Chart from './Chart';

class ChartPlot extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartData: {},
      inputText: "",
      code:  '{"type": "start", "timestamp": 1519862400000, "select": ["min_response_time", "max_response_time"], "group": ["os", "browser"]}'
      +',\n'+'{"type": "span",  "timestamp": 1519862400000, "begin": 1519862400000, "end": 1519862460000}'
      +',\n'+'{"type": "data",  "timestamp": 1519862400000, "os": "linux", "browser": "chrome", "min_response_time": 0.1, "max_response_time": 1.3}'
      +',\n'+'{"type": "data",  "timestamp": 1519862400000, "os": "mac", "browser": "chrome", "min_response_time": 0.2, "max_response_time": 1.2}'
      +',\n'+'{"type": "data",  "timestamp": 1519862400000, "os": "mac", "browser": "firefox", "min_response_time": 0.3, "max_response_time": 1.2}'
      +',\n'+'{"type": "data",  "timestamp": 1519862400000, "os": "linux", "browser": "firefox", "min_response_time": 0.1, "max_response_time": 1.0}'
      +',\n'+'{"type": "data",  "timestamp": 1519862400000, "os": "linux", "browser": "chrome", "min_response_time": 0.2, "max_response_time": 0.9}'
      +',\n'+'{"type": "data",  "timestamp": 1519862400000, "os": "mac", "browser": "chrome", "min_response_time": 0.1, "max_response_time": 1.0}'
      +',\n'+'{"type": "data",  "timestamp": 1519862400000, "os": "mac", "browser": "firefox", "min_response_time": 0.2, "max_response_time": 1.1}'
      +',\n'+'{"type": "data",  "timestamp": 1519862400000, "os": "linux", "browser": "firefox", "min_response_time": 0.3, "max_response_time": 1.4}'
      +',\n'+'{"type": "stop",  "timestamp": 1519862400000}',

    }
  }
  componentWillMount(){ 
  this.setState({inputText: this.state.code})
  this.eventClick(this.state.code)
}
  render(){
    var options = {
      mode: 'javascript',
      theme: 'material',
      lineNumbers: true
    };
    return (
      <div className='App'>
        <div className='App-CodePane'>      
          <CodeMirror value={this.state.code}
                      options={options}
                      onChange={(editor, data, value) => {
                        this.setState({inputText: value});
                      }}
          />
        </div>
        <Chart chartData={this.state.chartData} />
        <button className="App-Button" id="generate-chart" 
                onClick={()=>{this.eventClick(this.state.inputText);}} 
        > GENERATE CHART
        </button>
      </div>  
    )
  }
  eventClick = (input) => {
    console.log("GENERATE CHART");
    this.setState({code: input});
    try {
      var dataArray = this.prepareDataArray(JSON.parse("[" + input + "]"))
      console.log(dataArray);
      this.prepareChartDataArray(dataArray);
    } catch (e) {
      console.log(e)
      //console.log(input);
    }
    console.log(this.state.chartsArray);
  }

  prepareDataArray(input){
    console.log("prepareChartsArray");
    var start = false;
    var dataArray = [];
    var outputData = new Map();
    var datasets = new Map();
    for(var i in input) {
      console.log(i, input[i]);
      switch(String(input[i].type)) {
        case "start":
            console.log("start");
            start = true;
            outputData = new Map();
            outputData.set('timestamp', input[i].timestamp);
            outputData.set('group', input[i].group);
            outputData.set('select', input[i].select);           
            outputData.set('datasets', []); 
            break;
        case "span":
            console.log("span");
            if (start) {
              var begin = this.msToTime(input[i].begin - outputData.get('timestamp'))
              var end =   this.msToTime(input[i].end - outputData.get('timestamp'))
              outputData.set('labels', [ begin, end]); 
            } else {
              console.log("ignored");
            }
            break;
        case "data":
            console.log("data");            
            if (start) {
              var select = outputData.get('select');
              var lines = select.map((response_time) => input[i].os + " " + 
                                                        input[i].browser + " " + 
                                                        response_time
                                                      ); 
              var min = input[i].min_response_time;
              if (datasets.has(lines[0])) {
                  datasets.get(lines[0]).push(min)
              } else {
                  datasets.set(lines[0], [min])
              }
              var max = input[i].max_response_time;                                  
              if (datasets.has(lines[1])) {
                  datasets.get(lines[1]).push(max)
              } else {
                  datasets.set(lines[1], [max])
              }
            } else {
              console.log("ignored");
            }
            outputData.set('datasets', datasets); 
            //console.log(i, outputData);
            //console.log(i, datasets);
            break;
        case "stop":
            console.log("stop");
            if (start) { 
              start = false;
              dataArray.push(outputData);              
              //chart = [];
              //outputData = new Map();
              //datasets = new Map();
            } else {

            }
            break;
        default:
            console.log("invalid Type");
      }          
    }
    return dataArray;
  }
  prepareChartDataArray(dataArray){
    console.log("prepareChartDataArray");

    dataArray.forEach(data => { 
      var chart = this.prepareChartData(data);
      this.setState({chartData: chart})
      //this.state.chartsArray.unshift(chart);
    });
  }
  prepareChartData(chartData){
    console.log("prepareChartData");
    console.log(chartData);
    
    var datasets = [];
    let labels = Array.from( chartData.get("datasets").keys() );
    console.log(labels);
    
    const colors = ['rgba(255, 99, 132)','rgb(128,0,0)','rgba(54, 162, 235)','rgb(0,0,128)','rgba(255, 206, 86)','rgb(128,128,0)','rgba(0,255,0)','rgb(0,128,0)','rgb(255,0,255)','rgb(128,0,128)','rgb(0,255,255)','rgb(0,128,128)' ];
    var indColor = 0;
    function pushDatasets(element, index, array) {
      if (indColor >= colors.length) {
        indColor = 0;
      }
      datasets.push({
        label: labels[index],
        data: chartData.get("datasets").get(element),
        borderColor: [colors[indColor]]
      });
      indColor++;
    }
    labels.forEach(pushDatasets);
    console.log(datasets);
    return {
      labels: chartData.get("labels"),
      datasets: datasets
    }
  }
  msToTime(ms) {
    var seconds = parseInt((ms / 1000) % 60),
        minutes = parseInt((ms / (1000 * 60)) % 60),
        hours   = parseInt((ms / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes;
  }
}
export default ChartPlot;