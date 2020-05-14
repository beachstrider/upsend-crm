import logo from '../../images/favicon.png'
import { lighten, darken, opacify, rgb  } from "polished";

const palette = {
  background: {
    default: "#f7f7f7",
    paper: "#fefefe",
  },
  sidebar: {
    background: 'inherit',
    color: 'black',
    borders: "none",
    border: lighten(0.06, "#9e9898"),
    activeBackground: darken(0.2, "#f7f7f7"),
    hoverBackground:  darken(0.06, "#f7f7f7"),
    darkColor: "black",
  },
  common: {
    black: "#161616",
    white: "#fff",
    gray: '#6a6a6a',
    green: 'green',
    offline: '#ccc'
  },
  primary: {
    light: '#6a6a6a',
    contrastText: "#fff",
    main: rgb(0, 0, 0),
    white: '#fff',
    dark: '#161616',
    borders: "#ece9e9",
    logo: logo

  },
  skin: {
    main: "rgb(250, 247, 242)"
  },
  secondary:{
    main: "#444"
  },
 error: {
  light: "#e57373",
  main: "#f44336",
  dark: "#d32f2f",
  contrastText: "#fff",
 }


}

export default palette