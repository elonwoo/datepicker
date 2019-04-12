import React from 'react';
import DateRange12 from './Hours-12';
import DateRange24U from './Hours-24U';
// import Test from './Test';

const DatePicker = () => {
  return (
    <div style={{ marginLeft: '20px' }}>
      {/* <div>test</div> */}
      {/* <Test /> */}
      <div style={{ marginTop: '20px' }}>12小时</div>
      <DateRange12 />
      <div style={{ marginTop: '320px' }}>24小时 U</div>
      <DateRange24U />
    </div>
  );
};
export default DatePicker;
