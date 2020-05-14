import React from 'react';

const StatusBadge = (props) => {
  let bg_color = '#ccc';
  let border = false;
  switch(props.type){
    case 'success':
      bg_color = '#D0E6D4';
      break;
    case 'warning':
      bg_color = '#FFB600';
      break;
    case 'outline':
      bg_color = '#fff';
      border = 'solid 1px #000';
    default: 
      break;
  }

  return(
    <span style={{
      backgroundColor: bg_color,
      padding: '4px 8px',
      fontSize: '10px',
      fontWeight: '500',
      borderRadius: '4px',
      border: border,
      textTransform: 'capitalize',
      cursor: 'pointer',
      ...props.style
    }}>
      {props.children}
    </span>
  );
}

export default StatusBadge;