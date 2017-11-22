import React, { Component } from 'react';
import HighChartDemo from './HighchartDemo.js';
import ChartJsDemo from './ChartjsDemo.js';
import PlotlyDemo from './PlotlyDemo.js';
import sampleData from './sampleData.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App" style={{paddingLeft: 10, paddingRight: 10}}>
        <div className="App-header">
          <h2 style={{fontFamily: 'Comic Sans MS'}}>Awesomness Producer Charts Demo</h2>
        </div>
        <h2 style={{fontFamily: 'Comic Sans MS'}}> HIGHCHARTS </h2>
        <HighChartDemo dataSources={sampleData.dataSources} dataIds={sampleData.dataIds} />
        <h3 style={{textAlign: 'left'}}><strong> Pros: </strong></h3>
        <ul style={{textAlign: 'left'}}>
          <li>Documentation is pretty sensible, data plots are added and removed explicitly with methods</li>
          <li>rendering plot bands (aka average lines) is very simple using built in method</li>
          <li>Charts are automatically responsive out of the box</li>
          <li>animation of line plots are slick and a nice plus</li>
        </ul>
        <h3 style={{textAlign: 'left'}}><strong> Cons: </strong></h3>
        <ul style={{textAlign: 'left'}}>
          <li>Exporting is a little hairy, with failbacks requiring setup of a serverside rendering solution</li>
          <li>uses SVG for vector graphics. </li>
          <li>Unsure of the licensing situation, library is open source, but chart is supported by enterprise software</li>
        </ul>
        <hr />
        <ChartJsDemo dataSources={sampleData.dataSources} dataIds={sampleData.dataIds} />
        <h3 style={{textAlign: 'left'}}><strong> Pros: </strong></h3>
        <ul style={{textAlign: 'left'}}>
          <li>Completely Open Source</li>
          <li>Uses HTML Canvas to render chart elements</li>
          <li>animations are pretty smooth</li>
          <li>Able to bind event handlers directly to plot lines and legends</li>
        </ul>
        <h3><strong> Cons: </strong></h3>
        <ul style={{textAlign: 'left'}}>
          <li>Incrediably ardous to try and render average lines </li>
          <li>Requires user to push and pop data into chart object's array and then programmatically fire update event after data structure has changed</li>
          <li>In order to add events to legend, you have to monkey patch around existing methods. which means having to pass in the context of the chart element in events</li>
          <li>Styling within the chart is a lot more difficult because the chart is a canvas element, so invididual plots/legends are not easy to restyle</li>
        </ul>
        <hr />
        <PlotlyDemo dataSources={sampleData.dataSources} dataIds={sampleData.dataIds} />
        <h3 style={{textAlign: 'left'}}><strong> Pros: </strong></h3>
        <ul style={{textAlign: 'left'}}>
          <li>Charts are supported with d3, Plotly is a nice syntaxtic sugar on top.</li>
          <li>Exporting of charts is well supported and can be done from within the chart scoping tools on hover</li>
          <li>Highly customizable due to the use of powerful d3 library, able to use d3 selection tools to find specific data within the chart to style</li>

        </ul>
        <h3><strong> Cons: </strong></h3>
        <ul style={{textAlign: 'left'}}>
          <li>Chart view scoping tools appear on every chart on hover over, suprisingly easy to lose scope of plots</li>
          <li>Unable to directly bind to chart graph clicks, chart points and line items have a event binding system, but legends and axis do not</li>
          <li>Arbitrary lines and text (aka composing avg lines) are in two seperate sections. </li>
          <li></li>
        </ul>
        <hr />
      </div>
    );
  }
}

export default App;
