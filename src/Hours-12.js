import React from 'react';

import { DatePicker } from 'antd';
import moment from 'moment';

import 'antd/dist/antd.css';

class DateRange12 extends React.Component {
  state = {
    startValue: moment().subtract(12, 'hours'),
    endValue: moment(),
    endOpen: false
  };

  disabledStartDate = startValue => {
    const endValue = this.state.endValue;

    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() >= endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return (
      endValue.valueOf() <=
        moment(startValue._d)
          .startOf('day')
          .valueOf() ||
      endValue.valueOf() >=
        moment(startValue._d)
          .add(12, 'hours')
          .endOf('day')
          .valueOf()
    );
  };

  disabledDateTime = (e, x) => {
    console.log('e', e);
    console.log('x', x);
    const startValue = this.state.startValue;

    const startHours = moment(startValue).hours();
    const startMinutes = moment(startValue).minutes();
    const startSeconds = moment(startValue).seconds();

    const endDate = moment(startValue._d)
      .add(1, 'days')
      .date();

    const range = (start, end) => {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    };

    if (startHours < 12) {
      const disabledHours = () => {
        let hours = range(0, 24);
        hours.splice(startHours, startHours + 12);
        return hours;
      };

      const disabledMinutes = h => {
        if (h === startHours + 12) {
          return range(startMinutes + 1, 60);
        } else if (h === startHours) {
          return range(0, startMinutes);
        } else {
          return [];
        }
      };

      const disabledSeconds = (h, m) => {
        if (h === startHours + 12 && m === startMinutes) {
          return range(startSeconds, 60);
        } else if (h === startHours && m === startMinutes) {
          return range(0, startSeconds + 1);
        } else {
          return [];
        }
      };
      return {
        disabledHours: disabledHours,
        disabledMinutes: disabledMinutes,
        disabledSeconds: disabledSeconds
      };
    }

    if (startHours >= 12) {
      if (endDate !== moment(e._d).date()) {
        const disabledHours = () => {
          let hours = range(0, 24);
          hours.splice(startHours, 24 - startHours);
          return hours;
        };

        const disabledMinutes = h => {
          if (h === startHours) {
            return range(0, startMinutes);
          } else {
            return [];
          }
        };

        const disabledSeconds = (h, m) => {
          if (h === startHours && m === startMinutes) {
            return range(0, startSeconds + 1);
          } else {
            return [];
          }
        };
        return {
          disabledHours: disabledHours,
          disabledMinutes: disabledMinutes,
          disabledSeconds: disabledSeconds
        };
      }

      if (endDate === moment(e._d).date()) {
        const disabledHours = () => {
          let hours = range(0, 24);
          hours.splice(0, startHours - 11);
          return hours;
        };

        const disabledMinutes = h => {
          if (h === startHours - 12) {
            return range(startMinutes + 1, 60);
          } else {
            return [];
          }
        };

        const disabledSeconds = (h, m) => {
          if (h === startHours - 12 && m === startMinutes) {
            return range(startSeconds, 60);
          } else {
            return [];
          }
        };
        return {
          disabledHours: disabledHours,
          disabledMinutes: disabledMinutes,
          disabledSeconds: disabledSeconds
        };
      }
    }
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (open) {
      this.setState({ endValue: moment() });
    }
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  render() {
    const { startValue, endValue, endOpen } = this.state;

    return (
      <div>
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={startValue}
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          disabledTime={e => this.disabledDateTime(e, 'x')}
          disabledDate={this.disabledEndDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={endValue}
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    );
  }
}

export default DateRange12;
