import React, {Component} from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import Chart from './Chart';

/* 
  This is the body of code, here are the 
  functions that read the inputs, prepare 
  the JSON code and build a data array.
*/
class ChartPlot extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartsArray: [],
      inputText: "",
      code: "{type: 'start', timestamp: 1519862400000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}\n"+
            "{type: 'span',  timestamp: 1519862400000, begin: 1519862400000, end: 1519862460000}\n"+
            "{type: 'data',  timestamp: 1519862400000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.3}\n"+
            "{type: 'data',  timestamp: 1519862400000, os: 'mac', browser: 'chrome', min_response_time: 0.2, max_response_time: 1.2}\n"+
            "{type: 'data',  timestamp: 1519862400000, os: 'mac', browser: 'firefox', min_response_time: 0.3, max_response_time: 1.2}\n"+
            "{type: 'data',  timestamp: 1519862400000, os: 'linux', browser: 'firefox', min_response_time: 0.1, max_response_time: 1.0}\n"+
            "{type: 'data',  timestamp: 1519862400000, os: 'linux', browser: 'chrome', min_response_time: 0.2, max_response_time: 0.9}\n"+
            "{type: 'data',  timestamp: 1519862400000, os: 'mac', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.0}\n"+
            "{type: 'data',  timestamp: 1519862400000, os: 'mac', browser: 'firefox', min_response_time: 0.2, max_response_time: 1.1}\n"+
            "{type: 'data',  timestamp: 1519862400000, os: 'linux', browser: 'firefox', min_response_time: 0.3, max_response_time: 1.4}\n"+
            "{type: 'stop',  timestamp: 1519862400000}",

    }
  }
  componentWillMount(){
  this.setState({inputText: this.state.code})
  this.generateChart(this.state.code)
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
        <Chart chartsArray={this.state.chartsArray} />
        <button className="App-Button" id="generate-chart"
                onClick={()=>{this.generateChart(this.state.inputText);}} 
        > GENERATE CHART
        </button>
      </div>  
    )
  }
  generateChart = (inputText) => {
    console.log("GENERATE CHART");
    this.clearChartsArray();
    var jsonCode = this.prepareJsonCode(inputText);
    var dataArray = this.prepareDataArray(jsonCode);
    this.prepareChartDataArray(dataArray);
    this.setState({code: inputText});
    //console.log("ChartsArray: ", this.state.chartsArray);
  }
  clearChartsArray(){
    while(this.state.chartsArray.length > 0) {
      this.state.chartsArray.pop();
    }
  }
  prepareJsonCode(inputText){
    var inputText = inputText.replace(/\s/g,'')
                             .replace(/type:/g,'"type":')
                             .replace(/timestamp:/g,'"timestamp":')
                             .replace(/select:/g,'"select":')
                             .replace(/group:/g,'"group":')
                             .replace(/begin:/g,'"begin":')
                             .replace(/end:/g,'"end":')
                             .replace(/os:/g,'"os":')
                             .replace(/browser:/g,'"browser":')
                             .replace(/min_response_time:/g,'"min_response_time":')
                             .replace(/max_response_time:/g,'"max_response_time":')
                             .replace(/'/g,'"')
                             .replace(/}{/g,'},{');
    if(inputText.charAt(0) != '[') inputText = '['+inputText;
    if(inputText.slice(-1) != ']') inputText = inputText+']';
    try {
      var jsonCode = JSON.parse(inputText);
    } catch (e) {
      console.log(e)
      alert("ERRO: Input format");
    }
    return jsonCode;
  }
  prepareDataArray(jsonCode){
    console.log("prepareChartsArray");
    var dataArray = [],
        started = false,
        outputData = new Map(),
        datasets = new Map();
    for(var i in jsonCode) {
      //console.log(i, jsonCode[i]);
      switch(String(jsonCode[i].type)) {
        case "start":
            //console.log("start");
            started = true;
            outputData = this.startOutputData(jsonCode[i]);
            break;
        case "span":
            //console.log("span");
            if (started) {
              function msToTime(ms) {
                var minutes = parseInt((ms / (1000 * 60)) % 60),
                    hours   = parseInt((ms / (1000 * 60 * 60)) % 24);
              
                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;
              
                return hours + ":" + minutes;
              }
              var begin = msToTime(jsonCode[i].begin - outputData.get('timestamp')),
                  end   = msToTime(jsonCode[i].end   - outputData.get('timestamp'));
              outputData.set('labels', [ begin, end]); 
            } else {
              //console.log("ignored");
            }
            break;
        case "data":
            //console.log("data");            
            if (started) {
              function nameFormat(string) {
                return string.charAt(0).toUpperCase() + string.slice(1).replace("_response_time", " Response Time");
              }
              var os = nameFormat(jsonCode[i].os),
                  browser = nameFormat(jsonCode[i].browser),
                  select = outputData.get('select'),
                  linesName = select.map((response_time) => os+" "+browser+" "+nameFormat(response_time));

              var min = jsonCode[i].min_response_time;
              if (datasets.has(linesName[0])) {
                  datasets.get(linesName[0]).push(min)
              } else {
                  datasets.set(linesName[0], [min])
              }
              
              var max = jsonCode[i].max_response_time;                                  
              if (datasets.has(linesName[1])) {
                  datasets.get(linesName[1]).push(max)
              } else {
                  datasets.set(linesName[1], [max])
              }
            } else {
              //console.log("ignored");
            }
            outputData.set('datasets', datasets);
            break;
        case "stop":
            //console.log("stop");
            if (started) { 
              started = false;
              dataArray.push(outputData);
              datasets = new Map();
            } else {
              //console.log("ignored");
            }
            break;
        default:
            console.log("Type is invalid");
      }          
    }
    //console.log(dataArray);
    return dataArray;
  }
  startOutputData(startCode){
    console.log("startOutputData");
    var outputData = new Map();
    outputData.set('timestamp', startCode.timestamp);
    outputData.set('group', startCode.group);
    outputData.set('select', startCode.select);
    return outputData;
  }
  prepareChartDataArray(dataArray){
    console.log("prepareChartDataArray");

    dataArray.forEach(data => { 
      var chart = this.prepareChartData(data);
      this.state.chartsArray.push(chart);
    });
  }
  prepareChartData(chartData){
    console.log("prepareChartData");
    console.log(chartData); 
    var datasets = [];
    let labels = Array.from( chartData.get("datasets").keys() );
    
    const colors = ['rgba(255,99,132,0.7)','rgb(128,0,0,0.7)','rgba(54, 162, 235,0.7)','rgb(0,0,128,0.7)','rgba(255, 206, 86,0.7)','rgb(128,128,0,0.7)','rgba(0,255,0,0.7)','rgb(0,128,0,0.7)','rgb(255,0,255,0.7)','rgb(128,0,128,0.7)','rgb(0,255,255,0.7)','rgb(0,128,128,0.7)' ];
    var indColor = 0;
    
    function pushDatasets(element, index) {
      if (indColor >= colors.length) {
        indColor = 0;
      }
      datasets.push({
        label: labels[index],
        data: chartData.get("datasets").get(element),
        borderColor: [colors[indColor]],
        backgroundColor: ['rgba(255, 255, 255, 0)']
      });
      indColor++;
    }
    labels.forEach(pushDatasets);
    //console.log(datasets);
    return {
      labels: chartData.get("labels"),
      datasets: datasets
    }
  }
}
export default ChartPlot;