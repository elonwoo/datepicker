import React from 'react';

import { DatePicker } from 'antd';
import moment from 'moment';

import 'antd/dist/antd.css';

class DateRange24U extends React.Component {
  // 默认开始时间小于截止时间24小时
  state = {
    startValue: moment().subtract(24, 'hours'),
    endValue: moment(),
    endOpen: false,
  };

  onChange = (value, field) => {
    console.log('value', value);
    console.log('field', field);
    console.log({ [field]: value });
    this.setState({
      [field]: value,
    });
  };

  handleOpenChange = (open, field) => {
    if (field === 'startValue') {
      open
        ? this.setState({ endValue: moment() })
        : this.setState({ endOpen: true });
    } else if (field === 'endValue') {
      this.setState({ endOpen: open });
    }
  };

  // 定义开始时间选择时需要禁用的条件。此处条件为开始时间大于等于截止时间的都禁用
  disabledStartDate = startValue => {
    const { endValue } = this.state;

    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() >= endValue.valueOf();
  };

  /*
  disabledEndDate
  定义截止时间选择时需要禁用的条件。此处条件为：
  1. 截止时间小于等于开始时间当天0点的禁用
  2. 截止时间大于等于开始时间第2天24点的禁用
  该处这样做的目的是DatePicker组件会去和当前的时间点做比较：
  - 如果选择的时间小于当前时间（只是比时间），就只展示当天
  - 如果选择的时间大于当前时间，就只展示第二天
  所以用startOf()和endOf来把截止时间的前后两天时间都最大化
  再在后面用disabledDateTime方法来控制可选择的时间
  */

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return (
      endValue.valueOf() <=
        moment(startValue)
          .startOf('day')
          .valueOf() ||
      endValue.valueOf() >=
        moment(startValue)
          .add(1, 'days')
          .endOf('day')
          .valueOf()
    );
  };

  /*
  disabledDateTime控制可选择的时间
  const flag = endDate === moment(e._d).date()
  用该flag来比较截止时间选择器里点击的日期 =开始时间 or =开始时间+1天，从而禁用不同的时间范围
  */
  disabledDateTime = e => {
    const { startValue } = this.state;

    const startHours = moment(startValue).hours();
    const startMinutes = moment(startValue).minutes();
    const startSeconds = moment(startValue).seconds();

    const endDate = moment(startValue)
      .add(1, 'days')
      .date();

    const range = (start, end) => {
      const result = [];
      for (let i = start; i < end; i += 1) {
        result.push(i);
      }
      return result;
    };

    const flag = endDate === moment(e).date();

    const disabledHours = () => {
      const hours = range(0, 24);
      flag
        ? hours.splice(0, startHours + 1)
        : hours.splice(startHours, 24 - startHours);
      return hours;
    };

    const disabledMinutes = h => {
      if (h === startHours) {
        return flag ? range(startMinutes + 1, 60) : range(0, startMinutes);
      } else {
        return [];
      }
    };

    const disabledSeconds = (h, m) => {
      if (h === startHours && m === startMinutes) {
        return flag ? range(startSeconds, 60) : range(0, startSeconds + 1);
      } else {
        return [];
      }
    };
    return {
      disabledHours,
      disabledMinutes,
      disabledSeconds,
    };
  };

  render() {
    const { startValue, endValue, endOpen } = this.state;

    return (
      <div>
        <DatePicker
          showTime
          value={startValue}
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={this.disabledStartDate}
          onChange={value => this.onChange(value, 'startValue')}
          onOpenChange={open => this.handleOpenChange(open, 'startValue')}
        />
        <DatePicker
          showTime
          value={endValue}
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={this.disabledEndDate}
          disabledTime={this.disabledDateTime}
          onChange={value => this.onChange(value, 'endValue')}
          open={endOpen}
          onOpenChange={open => this.handleOpenChange(open, 'endValue')}
        />
      </div>
    );
  }
}

export default DateRange24U;
