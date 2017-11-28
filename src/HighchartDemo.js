import React, { Component } from 'react';
import highChart from 'highcharts';
import PropType from 'proptypes';
import { calculateTheAverage } from './math-helpers.js'

class HighchartDemo extends Component {
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
    this.highChartElem = null;
    this.chartObj      = null;
    this._setPlotLine = this._setPlotLine.bind(this);
    this.state = {
      threeDayAvg: 0,
      sevenDayAvg: 0
    };
  }
  _setRef = highChartInstance => this.highChartElem = highChartInstance
  componentDidMount() {
    if (this.highChartElem) {
      this.chartObj = highChart.chart(this.highChartElem, {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Test of a Line Graph With HighCharts',
          margin: 30,
          verticalAlign: 'top',
          y: 20
        },
        xAxis: {
          type: 'linear',
          tickInterval: 1,
          title: {
            text: 'Age of Video'
          }
        },
        yAxis: {
          type: 'logarithmic',
          gridLineWidth: 1,
          title: {
            text: 'Video Views Over Time'
          }
        },
        series: [],
        legend: {
          verticalAlign: 'top',
          lineHeight: 20,
          margin: 30,
          y: 30
        },
        plotOptions: {
          series: {
            events: {
              hide: () => {
                this._setPlotLine();
              },
              show: () => {
                this._setPlotLine();
              }
            }
          }
        }
      });
      this._setSeriesData();
    }
  }
  componentDidUpdate() {
    let { dataIds } = this.props;
    if (this.chartObj && dataIds.length > 0) {
      this._setSeriesData();
    }
  }
  _setSeriesData = () => {
    let { dataIds, dataSources } = this.props;
    if (this.chartObj.series.length === 0) {
      return Promise.all(dataIds.map(dataId => {
        let currentDataPoint = dataSources[dataId];
        let dataPoint = {
          name: currentDataPoint['dataTitle'],
          color: currentDataPoint['dataColor'],
          data: currentDataPoint['dataSeries']
        };
        this.chartObj.addSeries(dataPoint);
        return dataPoint;
      })).then(() => {
        if (this.state.threeDayAvg === 0 && this.state.sevenDayAvg === 0) {
          this._setPlotLine();
        }
      });
    }
  }
  _setPlotLine() {
    if (this.chartObj.series.length > 0) {
      let threeDayDataPoints = [];
      let sevenDayDataPoints = [];
      let dataSeriesFiltered = this.chartObj.series.filter(series => series.visible).map(filteredSeries => filteredSeries.yData)
      return Promise.all(dataSeriesFiltered.map((yDataSet) => {
        let currentThreeDayData = yDataSet.slice(0, 3);
        let currentSevenDayData = yDataSet.slice(0, 7);
            threeDayDataPoints = threeDayDataPoints.concat(currentThreeDayData);
            sevenDayDataPoints = sevenDayDataPoints.concat(currentSevenDayData);
            return null;
        })).then(() => {
          this.setState({
            threeDayAvg: calculateTheAverage(threeDayDataPoints),
            sevenDayAvg: calculateTheAverage(sevenDayDataPoints)
          })
        }).then(
          () => this._addPlotLines()
        )
      }
  }
  _addPlotLines = () => {
    if (this.chartObj) {
      let currentY = this.chartObj.yAxis[0];
      let { threeDayAvg, sevenDayAvg } = this.state;

      currentY.removePlotLine('average-plotline-1');
      currentY.removePlotLine('average-plotline-2');

      currentY.addPlotLine({
        color: '#a4a0a0',
        width: 2,
        label: {
          text: `3 Day Average (${threeDayAvg})`
        },
        dashStyle: 'Dash',
        value: threeDayAvg,
        id: 'average-plotline-1'
      })
      currentY.addPlotLine({
        color: '#a4a0a0',
        width: 2,
        label: {
          text: `7 Day Average (${sevenDayAvg})`
        },
        dashStyle: 'Dash',
        value: sevenDayAvg,
        id: 'average-plotline-2'
      })
    }
  }
  render(){
    return (<div>
      <div className="high-chart" style={{width: '100%', height: 500}} ref={this._setRef} />
      <h3> DEMOS </h3>
      <iframe width="100%" height="450" src="//jsfiddle.net/3n26xmtz/embedded/result/" frameBorder="0"></iframe>
      <iframe width="100%" height="450" src="//jsfiddle.net/ojh0tsj5/embedded/result/" frameBorder="0"></iframe>
    </div>);
  }
}

export default HighchartDemo;
