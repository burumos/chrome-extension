import React from 'react';
import ReactDOM from 'react-dom';

console.log('load bar.js');

class RootElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scripts: [],
    };
  }

  componentDidMount() {
  }

  render () {
    return (
      <div>
        <StringMaker />
      </div>
    )
  }
}

class StringMaker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      format: "%02d",
      argument: {
        start: 1,
        end: 2,
      },
    };
    this.handlerChange = this.handlerChange.bind(this);
    this.format = this.format.bind(this);
  }

  handlerChange(target, event) {
    const targetKeys = target.split('.');
    const value = event.target.value;
    if (targetKeys.length === 1) {
      this.setState({[targetKeys[0]]: value});
    } else {
      const firstKey = targetKeys.shift();
      const lastKey = targetKeys.pop();
      let copeidState = this.state[firstKey];
      let targetState = copeidState;
      targetKeys.forEach(key => {
        targetState = targetState[key];
      })
      targetState[lastKey] = value;
      this.setState({[firstKey]: copeidState});
    }
  }

  format() {
    const template = this.state.format;
    const argument = this.state.argument;
    let result = "";
    if (!template
        || argument.start > argument.end)
      return result;

    let formatStr = /%(\w\d|)d/.exec(template);
    // console.log(formatStr);
    if (!Array.isArray(formatStr)) return "error: not found '%d'";
    formatStr = formatStr[0];
    let formatLength = 0, formatChar = '';
    if (formatStr.length === 4) {
      formatLength = formatStr[2];
      formatChar = formatStr[1];
    }

    let numbers = [];
    for (let i = argument.start; i <= argument.end; i++) {
      numbers.push(i);
    }
    console.log('numbers', numbers);
    result = numbers.map(num => {
      return template.replace(
        formatStr,
        (num+'').padStart(formatLength, formatChar));
    }).join(' ');
    return result
  }

  render() {
    return (
      <div className="table">
        <div className="row">
          <div className="cell format">format</div>
          <div className="cell argument">argument</div>
          <div className="cell result">result</div>
        </div>
        <div className="row">
          <div className="cell format">
            <input type="text" value={this.state.format}
                   onChange={(e) => this.handlerChange('format', e)}/>
          </div>
          <div className="cell argument">
            <input type="number" value={this.state.argument.start}
                   onChange={(e) => this.handlerChange('argument.start', e)}
            />
            ~
            <input type="number" value={this.state.argument.end}
                   onChange={(e) => this.handlerChange('argument.end', e)}
            />
          </div>
          <div className="cell result">
            <input type="text" value={this.format()} readOnly/>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <RootElement />,
  document.getElementById('root')
)
