import "react-app-polyfill/ie11";
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';

// React is loaded and is available as React and ReactDOM
// imports should NOT be used

class MyPortal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }
  
  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
class Tooltip extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      visible: false,
    };
    
    this.width = props.width || 256;
    this.space = props.space || 16;
    
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }
  
  showTooltip() {
    // some maths to align the tooltip with whatever you just hovered over (the 'target')
    // or maybe it's 'math' in your weird country
    const style = { width: this.width }; // this style object will be passed as the tooltip's 'style' prop
    const dimensions = this.el.getBoundingClientRect(); // where on the screen is the target
    
    // center align the tooltip by taking both the target and tooltip widths into account
    style.left = (dimensions.left + (dimensions.width / 2)) - (this.width / 2);
    style.left = Math.max(this.space, style.left); // make sure it doesn't poke off the left side of the page
    style.left = Math.min(style.left, document.body.clientWidth - this.width - this.space); // or off the right
    
    if (dimensions.top < window.innerHeight / 2) { // the top half of the page
      // when on the top half of the page, position the top of the tooltip just below the target (it will stretch downwards)
      style.top = dimensions.top + dimensions.height + this.space;
    } else {
      // when on the bottom half, set the bottom of the tooltip just above the top of the target (it will stretch upwards)
      style.bottom = (window.innerHeight - dimensions.top) + this.space;
    }
    
    this.setState({
      visible: true,
      style,
    });
  }
  
  hideTooltip() {
    this.setState({visible: false});
  }

  render() {
    // Write your code here
    return (
      <span // a span so it's valid HTML no matter where it's used
        onMouseOver={this.showTooltip}
        onMouseOut={this.hideTooltip}
        className="tooltip-trigger-text"
        ref={el => this.el = el}
      >
        {this.props.children}
        
        {this.state.visible && (
          <MyPortal>
            <div // this <div> isn't actually a child of the <span> above. Magic portal.
              className="tooltip-body"
              style={this.state.style}
            >
              {this.props.text}
            </div>
          </MyPortal>
        )}
      </span>
    );
  }
}

class App extends React.Component {
  state = {
    text: ''
  }

  onDocumentClick = (event) => {
    if (event.target.tagName === 'BUTTON') {
      this.setState({ text: event.target.textContent })
    }
  }
  
  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick)
  }

  render() {
    return <div>
    
      <Tooltip text={this.state.text}>
      {this.props.children}
        </Tooltip>
    </div>
  }
}

document.body.innerHTML = "<div id='root'></div><div id='tooltip'></div>";
const rootElement = document.getElementById("root");
ReactDOM.render(<App>
  <button id="button1">First button</button>
  <button id="button2">Second button</button>
</App>, rootElement);
document.getElementById("button2").click();
setTimeout(() => console.log(document.body.innerHTML));

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
