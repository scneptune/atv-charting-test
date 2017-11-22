import React, { Component } from 'react';
import chartJs from 'chart.js';
import 'chartjs-plugin-annotation';
import { calculateTheAverage } from './math-helpers.js';
import PropType from 'proptypes';

export default class ChartJsDemo extends Component {
  static propTypes = {
    dataIds: PropType.array,
    dataSources: PropType.object
  }
  static defaultProps = {
    dataIds: [],
    dataSources: {}
  }
  constructor(props) {
    super(props);
    this.chartElem = null;
    this.chartObj = null;
    this.state = {
      threeDayAvg: 0,
      sevenDayAvg: 0
    }
  }
  componentDidMount() {
    let chartDefaultClick = chartJs.defaults.global.legend.onClick;
    let self = this;
    if (self.chartElem) {
      self.chartObj = new chartJs(self.chartElem, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          title: {
            display: true,
            text: 'Chart.js Demo',
            fontFamily: 'Bookman',
            fontSize: 28
          },
          legend: {
            display: true,
            onClick: (e, legendItem) => {
              var index = legendItem.datasetIndex;
              self.chartObj.data.datasets[index].showLine = !self.chartObj.data.datasets[index].showLine
              self.chartObj.update();
              chartDefaultClick.call(self.chartObj , e, legendItem)
              self._setAPlotLine()
            }
          },
          responsive: true,
          scales: {
            yAxes: [{
              type: 'linear',
              stepSize: 10000,
              id: 'average-views-y',
              scaleLabel: {
                display: true,
                labelString: 'Views per day'
              }
            }],
            xAxes: [{
              type: 'category',
              labels: [0,1,2,3,4,5,6,7],
              id: 'time-over-days',
              scaleLabel: {
                display: true,
                labelString: 'Days since published'
              },
              ticks: {
                beginAtZero: true,
                max: 8,
                min: 0,
                stepSize: 1
              }
            }]
          },
          annotation: {
            events: ['click'],
            annotations: [],
            drawTime: 'afterDraw',
          }
        }
      })
      this._setDataSet();
    }
  }
  _setDataSet = () => {
    let { dataIds, dataSources } = this.props;
    let chartLib = this.chartObj;
    if (chartLib && dataIds.length > 0) {
      chartLib.data.datasets = [];
      chartLib.update();

      return Promise.all(dataIds.map(dataId => {
        let currentData = dataSources[dataId];
        chartLib.data.datasets.push({
          data: currentData['dataSeries'],
          xAxisID: 'time-over-days',
          yAxisID: 'average-views-y',
          label: currentData['dataTitle'],
          backgroundColor: currentData['dataColor'],
          borderColor: currentData['dataColor'],
          borderWidth: 3,
          lineTension: 0.02,
          showLine: true,
          spanGaps: true,
          fill: false
        });
        return chartLib
      }))
      .then(() => this._setAPlotLine())
      .then(() => chartLib.update());
    }
  }
  componentDidUpdate() {
    let { threeDayAvg, sevenDayAvg } = this.state;
    let { dataIds } = this.props;
    if (this.chartObj && (dataIds.length > 0) && (threeDayAvg === 0 && sevenDayAvg === 0)) {
      this._setDataSet();
    }
  }
  _setAPlotLine = () => {
    let chartLib = this.chartObj;
    if (chartLib && chartLib.data.datasets.length > 0) {
      let threeDayDataPoints = [];
      let sevenDayDataPoints = [];
      let dataSeriesFiltered = chartLib.data.datasets.filter(
        series => (series.showLine)
      ).map(
        filteredSeries => filteredSeries.data
      );
      return Promise.all(dataSeriesFiltered.map(dataSet => {
        let currentThreeDayData = dataSet.slice(0, 3);
        let currentSevenDayData = dataSet.slice(0, 7);
            threeDayDataPoints = threeDayDataPoints.concat(currentThreeDayData);
            sevenDayDataPoints = sevenDayDataPoints.concat(currentSevenDayData);
            return null;
        })
      ).then(() => this.setState({
          threeDayAvg: calculateTheAverage(threeDayDataPoints),
          sevenDayAvg: calculateTheAverage(sevenDayDataPoints)
        },
        () => this._addPlotLines()
      )
    )
    }
  }
  _addPlotLines = () => {
    let { threeDayAvg, sevenDayAvg } = this.state;
    let chartLib = this.chartObj;
    chartLib.options.annotation.annotations = [];
    chartLib.update();
    chartLib.options.annotation.annotations = [
      {avg: threeDayAvg, title: `Three Day Average (${threeDayAvg})`},
      {avg: sevenDayAvg, title: `Seven Day Average (${sevenDayAvg})`}
    ].map((avgPlotLine, index) => ({
        id: `hline-${index}`,
        type: "line",
        mode: "horizontal",
        scaleID: "average-views-y",
        value: avgPlotLine.avg,
        borderColor: '#a7a7a7',
        borderDash: [3, 3],
        borderWidth: 3,
        label: {
          content: avgPlotLine.title,
          enabled: true
        }
      })
    );
    chartLib.update();
    return chartLib;
  }
  _setChartRef = chartInstance => this.chartElem = chartInstance
  render(){
    return (<canvas height="400" width="600" className="chart-js-demo" ref={this._setChartRef} />);
  }
}
