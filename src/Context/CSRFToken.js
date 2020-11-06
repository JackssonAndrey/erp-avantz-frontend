import React from 'react';
import getCookie from '../utils/functions';

var csrftoken = getCookie('csrftoken');

const CSRFToken = () => {
  return (
    <input type="hidden" name="csrf_token" value={csrftoken} />
  );
};
export default CSRFToken;
