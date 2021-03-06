import React, { Component } from 'react';
import PropType from 'proptypes';
import { calculateTheAverage } from './math-helpers.js';
import Plotly from 'plotly.js';

export default class PlotlyDemo extends Component {
  static propTypes = {
    dataIds: PropType.array,
    dataSources: PropType.object
  }
  constructor(props) {
    super(props);
    this.plotlyElem = null;
    this.plotlyObj = null;
    this.plotlyLayout = {
      autosize: true,
      title: 'Test of Plotly Graph',
      xaxis: {
        range: [0, 7],
        type: 'linear'
      },
      legend: {
        orientation: "h"
      },
      modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'pan2d',
        'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'hoverClosestCartesian',
        'hoverCompareCartesian', 'zoom3d', 'tableRoation', 'orbitRotation', 'pan3d',
        'toggleHover'
      ],
      modeBarButtons: false,
      staticPlot: true,
      shapes: [],
      annotations: []
    };
    this.state = {
      threeDayAvg: 0,
      sevenDayAvg: 0
    }
  }
  _setRef = elemInstance => (this.plotlyElem = elemInstance)
  _setDataSource = dataId => {
    let {dataSources} = this.props;
    return {
      id: dataId,
      mode: 'scatter',
      y: dataSources[dataId].dataSeries,
      x: [0,1,2,3,4,5,6,7],
      name: dataSources[dataId].dataTitle,
      showlegend: true,
      line: {
        color: dataSources[dataId].dataColor
      },
      visible: true
    }
  }
  async componentDidMount() {
    let { dataIds } = this.props;
    if (this.plotlyElem && dataIds.length > 0) {
      let initalData = dataIds.map(this._setDataSource)
      await this._calculateAverages(dataIds);
      let initialLayout = {...this.plotlyLayout, shapes: this._setAvgLines(), annotations: this._setAnnotations()}
      let currentPlot = Plotly.newPlot(this.plotlyElem, initalData, initialLayout);
      currentPlot.then(gd => {
        gd.on('plotly_restyle', async (d) => {
            let filteredLines = gd.data.filter(
              plotData => ((plotData.visible === true) && plotData.showlegend)
            ).map(line => line.id)

            await this._calculateAverages(filteredLines);
            let nextLayout = {...this.plotlyLayout, shapes: this._setAvgLines(), annotations: this._setAnnotations()}
            Plotly.relayout(gd, nextLayout);
        })
      })
      window.onresize = () => {
        Plotly.Plots.resize(this.plotlyElem)
      }
    }
  }
  _calculateAverages = visibleDataIds => {
    let { dataSources } = this.props;
    let combinedThreeDay = []
    let combinedSevenDay = []
    for (let dataId in visibleDataIds) {
      let currentSeries = dataSources[visibleDataIds[dataId]].dataSeries;
      combinedThreeDay = combinedThreeDay.concat(currentSeries.slice(0, 3))
      combinedSevenDay = combinedSevenDay.concat(currentSeries.slice(0, 7))
    }

    return this.setState({
      threeDayAvg: calculateTheAverage(combinedThreeDay),
      sevenDayAvg: calculateTheAverage(combinedSevenDay)
    });
  }
  _setAvgLines = () => {
    let { threeDayAvg, sevenDayAvg } = this.state;
    return [threeDayAvg, sevenDayAvg].map(
      value => ({
        type: 'line',
        x0: 0,
        y0: value,
        x1: 7,
        y1: value,
        layer: "below",
        line: {
          dash: 'dot',
          color: "#9a9a9a",
          width: 2
        }
      })
    );
  }
  _setAnnotations = () => {
    let { threeDayAvg, sevenDayAvg } = this.state;
    return [
      { title: `Three Day Average (${threeDayAvg})`, value: threeDayAvg },
      { title: `Seven Day Average (${sevenDayAvg})`, value: sevenDayAvg }
    ].map(avgValue => ({
        x: 0.5,
        y: avgValue.value,
        xref: 'x',
        yref: 'y',
        xanchor: 'left',
        yanchor: 'bottom',
        text: avgValue.title,
        showarrow: false
      })
    )
  }
  render(){
    let styleResize = {
      width: 90 + '%',
      'marginLeft': (100 - 90) / 2 + '%',
      height: 80 + 'vh',
      'marginTop': (100 - 80) / 2 + 'vh'
    }
    return (<div>
      <div id="plotly-demo" style={styleResize} ref={this._setRef} />
      <h2> OTHER DEMOS </h2>
      <h4> annotated plots and axises </h4>
      <iframe height='400' scrolling='no' title='Labelling Lines with Annotations with Plotly.js Charts' src='//codepen.io/plotly/embed/BNMROB/?height=400&theme-id=0&default-tab=result&embed-version=2' frameBorder='no' style={{width: '100%'}}>
        See the Pen
        <a href='https://codepen.io/plotly/pen/BNMROB/'>Labelling Lines with Annotations with Plotly.js Charts</a>
          by plotly (<a href='https://codepen.io/plotly'>@plotly</a>) on <a     href='https://codepen.io'>CodePen
        </a>.
      </iframe>
      <h4> animation </h4>
      <iframe height='400' scrolling='no' title='animations-animating-the-data' src='//codepen.io/plotly/embed/ZpWPpj/?height=400&theme-id=0&default-tab=result&embed-version=2' frameBorder='no' style={{width: '100%'}}>
        See the Pen <a href='https://codepen.io/plotly/pen/ZpWPpj/'>animations-animating-the-data</a> by plotly
        (<a href='https://codepen.io/plotly'>@plotly</a>) on <a href='https://codepen.io'>CodePen</a>.
      </iframe>
      <h4></h4>
    </div>);
  }
}
