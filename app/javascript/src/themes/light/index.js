import { createMuiTheme } from "@material-ui/core/styles";
import palette from "./palette";

let theme = createMuiTheme({
  typography: {
    //font-family: 'IBM Plex Sans', sans-serif;
    //font-family: 'IBM Plex Sans Condensed', sans-serif;
    //fontFamily: "\"IBM Plex Sans\", \"Helvetica\", \"Arial\", sans-serif",
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',

    //fontFamily: "\"Roboto Mono\", \"Helvetica\", \"Arial\", sans-serif",
    fontSize: 15,
    /*fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,*/

    h2: {
      //fontFamily: "\"IBM Plex Sans Condensed\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: "bold",
      fontSize: "4rem",
      letterSpacing: 0.5,
    },

    h3: {
      //fontFamily: "\"IBM Plex Sans Condensed\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: "bold",
      fontSize: 26,
      letterSpacing: 0.5,
    },

    h4: {
      //fontFamily: "\"IBM Plex Sans Condensed\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: "bold",
      fontSize: 30,
      letterSpacing: 0.5,
    },

    h5: {
      //fontFamily: "\"IBM Plex Sans Condensed\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: "bold",
      fontSize: 26,
      letterSpacing: 0.5,
    },

    h6: {
      //fontFamily: "\"IBM Plex Sans Condensed\", \"Helvetica\", \"Arial\", sans-serif",
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontWeight: "bold",
      fontSize: 19,
      letterSpacing: 0.5,
    }
  },
  palette: palette,
  shape: {
    borderRadius: 3,
  },
});

theme = {
  ...theme,
  overrides: {
    MuiPaper: {
      root: {
        '& a.disable-btn': {
          cursor: 'pointer',
          display: 'flex',
          fontWeight: 500,
          marginRight: '5px !important',
          margin: 2,
        },
        '& a.disable-btn.disabled': {
          opacity: 0.4
        }
      }
    },
    MuiTypography: {
      h5: {
        [theme.breakpoints.down("sm")]: {
          fontSize: 21,
        },
      },
    },
    MuiDrawer: {
      paper: {
        //backgroundColor: '#18202c',
        backgroundColor: "#f8f8f8",
      },
    },
    MuiButton: {
      root: {
        borderRadius: "5px",
      },
      label: {
        textTransform: "none",
        fontWeight: "600",
      },
      contained: {
        boxShadow: "none",
        backgroundColor: "rgb(250, 247, 242)",
        "&:hover": {
          backgroundColor: "rgb(245, 238, 227)",
        },
        "&:active": {
          boxShadow: "none",
        },
      },
    },

    MuiAppBar: {
      colorDefault: {
        color: palette.background.default,
        backgroundColor: palette.background.dark,
      },
      colorPrimary: {
        //borderBottom: `1px solid ${palette.common.white}`
      },
    },

    MuiBadge: {
      colorPrimary: {
        backgroundColor: "#10e810",
      },
    },

    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: "none",
        margin: "0 16px",
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up("md")]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: theme.palette.primary.borders, //'#d3e8d7', //#404854',
      },
    },
    MuiMenu: {
      paper: {
        marginTop: "4px",
        boxShadow: "none",
      },
    },
    MuiList: {
      root: {
        backgroundColor: "#F9F7F2",
        paddingLeft: '8px',
        paddingRight: '8px',
        "&.MuiMenu-list .MuiListItem-root": {
          marginRight: "10px",
          paddingLeft: "40px",
          borderRadius: "5px",
          minHeight: "42px",
          '& .MuiCheckbox-root': {
            padding: '4px 9px'
          }
        },
        "&.MuiMenu-list .MuiListItem-root:hover": {
          backgroundColor: "unset",
          backgroundImage:
            "linear-gradient(to right, rgba(255, 211, 0, 1), rgba(255, 211, 0, 0))",
        },
        "&.MuiMenu-list .list-scroll-menu": {
          overflow: 'auto'
        },
        "&.MuiMenu-list .list-scroll-menu::-webkit-scrollbar": {
          width: '6px'
        },
        "&.MuiMenu-list .list-scroll-menu::-webkit-scrollbar-track": {
          background: '#f1f1f1'
        },
        "&.MuiMenu-list .list-scroll-menu::-webkit-scrollbar-thumb": {
          background: '#888',
          borderRadius: '6px'
        },
        "&.MuiMenu-list .list-scroll-menu::-webkit-scrollbar-thumb:hover": {
          background: '#555'
        },
        "& .MuiInput-root": {
          width: "100%",
          // marginLeft: "8px",
          // marginRight: "8px",
          marginBottom: "10px",
          paddingLeft: "25.7px",
          borderRadius: "5px",
          backgroundColor: "#fff",
          "& input": {
            fontSize: "14px",
            padding: "10px 0 10px",
          },
          "& input::placeholder": {
            fontSize: "14px",
          },
          "& .MuiSvgIcon-root": {
            marginRight: "14px",
          },
        },
        "& .MuiInput-underline:before": {
          borderBottom: "none !important",
        },
        "& .MuiInput-underline.Mui-focused:before": {
          borderBottom: "none !important",
        },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
          borderBottom: "none !important",
        },
        "& .MuiInput-underline:after": {
          borderBottom: "none !important",
        },
        "& .MuiInput-underline.Mui-focused:after": {
          borderBottom: "none !important",
        },
        "& .btn-bottom-new": {
          width: '95%',
          backgroundColor: 'rgba(255, 211, 0)',
          marginTop: '10px',
        },
        "& .btn-bottom-new:hover": {
          backgroundColor: 'rgb(251, 225, 102) !important',
        }
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: "inherit",
        marginRight: 0,
        "& svg": {
          fontSize: 20,
        },
        minWidth: 34
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
    MuiExpansionPanel: {
      rounded: {
        color: theme.palette.common.gray,
      },
    }
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: 48,
    },
  },
};

export default theme;
