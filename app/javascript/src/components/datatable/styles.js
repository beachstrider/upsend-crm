import { createTheme } from 'react-data-table-component';

createTheme('solarized', {
  text: {
    primary: '#000',
    secondary: '#404040',
  },
  context: {
    background: '#cb4b16',
    text: '#FFFFFF',
  },
  divider: {
    default: '#d2d6de',
  },
  button: {
    default: '#616161',
    hover: 'rgba(0,0,0,.08)',
    focus: 'rgba(255,255,255,.12)',
    disabled: 'rgba(0,0,0,.12)',
  },
  sortFocus: {
    default: '#404040',
  },
});

const styles = {
  text: {
    color: '#fff',
  },
  subHeader: {
    style: {
      padding: 0,
    },
  },
  headCells: {
    style: {
      fontWeight: '700',
    },
  },
  rows: {
    style: {
      borderBottomStyle: 'solid',
      borderBottomColor: '#d2d6de',
      borderBottomWidth: '1px' 
    }
  },
  cells: {
    style: {
      fontWeight: '500 !important',
      backgroundClip: 'padding-box',
      borderRightStyle: 'solid',
      borderRightColor: 'transparent',
      borderRightWidth: '1px',
      '&:not(:first-of-type):not(:last-of-type)::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        marginTop: '4px',
        marginBottom: '4px',
        width: '1px',
        backgroundImage: 'linear-gradient(rgba(255,211,0,0),rgba(255,211,0,1),rgba(255,211,0,0))',
      },
    },
  },

  pagination: {
    style: {
      borderTop: 'none'
    }
  }
};

export default styles;