import './App.css';
import React, { useState, useEffect } from 'react';
import { VictoryBar, VictoryChart } from 'victory';
import DatePicker from 'react-datepicker';
import * as d3 from 'd3';
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";

// moment().format();

//our 'api' url
const url = 'https://gist.githubusercontent.com/AchilleasTyrnenopoulos/df3cde5b381a5d2f442e595215e28e08/raw/YearlyFootfall';

//parse data
const row = d => {
  d.value = +d.value;
  return d;
};

function App() {

  const [data, setData] = useState([]);
  const [originalArr, setOriginalArr] = useState([]);
  const [startDate, setStartDate] = useState(new Date("2021/10/01"));
  const [endDate, setEndDate] = useState(new Date("2021/10/30"));

  useEffect(() => {
    d3.csv(url, row)
      .then(data => {
        setOriginalArr(data);
        let tempData = data;

        //format the dates
        let tempStart = moment(startDate).format("Y/MM/DD");
        let tempEnd = moment(endDate).format("Y/MM/DD");

        setData(tempData);
        GetStats(tempData, tempStart, tempEnd);
      });
  }, [startDate, endDate]);

  function GetStats(data, start, end) {
    console.log("Selected start date: ", start);
    console.log("Selected end date: ", end);

    let startIndex = data.findIndex(el => el.time === start);
    let endIndex = data.findIndex(el => el.time === end);

    if (startIndex >= 0 && endIndex >= 0) {
      let filteredArray = data.splice(startIndex, (endIndex - startIndex) + 1);

      setData(filteredArray);
    }

  }

  return (
    <div className="App croppedContent">

      <VictoryChart
        style={{ tickLabels: { fontSize: 120 } }}
        domainPadding={50}
        padding={{ top: 10, bottom: 40, left: 30, right: 10 }}
      >
        <VictoryBar data={data} x="time" y="value" style={{ data: { fill: "#3ac57c" } }} />
      </VictoryChart>
      
      <div className="mt-5 mb-5 d-inline-flex">
        <div style={{ marginRight: 20 + 'px' }}>
          <label>From date: </label>
          <DatePicker
            selected={startDate}
            minDate={new Date(originalArr[0]?.time)}
            maxDate={new Date(originalArr[originalArr.length - 1]?.time)}
            selectsStart
            startDate={startDate}
            onChange={date => setStartDate(date)}
            placeholderText="Choose start date"
            className="form-control"
          />
        </div>

        <div>
          <label>To date: </label>
          <DatePicker
            selected={endDate}
            minDate={new Date(originalArr[0]?.time)}
            maxDate={new Date(originalArr[originalArr.length - 1]?.time)}
            selectsStart
            startDate={endDate}
            onChange={date => setEndDate(date)}
            placeholderText="Choose end date"
            className="form-control"
          />
        </div>

      </div>
    </div>
  );
}

export default App;
