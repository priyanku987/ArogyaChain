/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';

export default function ADatePicker({ value, setValue }) {
  return (
    <div>
      <DatePicker
        onChange={val => setValue(val)}
        value={value}
        style={{ width: '100%' }}
      />
    </div>
  );
}
