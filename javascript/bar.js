import React from 'react';
import ReactDOM from 'react-dom';
import '../stylesheet/bar.scss';

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
      copyMessage: '',
      filled0: true,
    };
    this.handlerChange = this.handlerChange.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.format = this.format.bind(this);
    this.getSuggest = this.getSuggest.bind(this);
    this.handleAcceptSugget = this.handleAcceptSugget.bind(this);
    this.handleChangeFilled0 = this.handleChangeFilled0.bind(this);
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

  handleCopy(event) {
    console.log('copy', event.target);
    this.setState({copyMessage: 'copied!!'});
    document.getElementById('format-text').select();
    document.execCommand('copy');
    window.setTimeout(()=> this.setState({copyMessage: ''}), 2000);
  }

  format() {
    const template = this.state.format;
    const argument = this.state.argument;
    let result = "";
    if (!template
        || argument.start > argument.end)
      return result;

    let formatStr = /%([\w\d]+|)d/.exec(template);
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
    result = numbers.map(num => {
      return template.replace(
        formatStr,
        (num+'').padStart(formatLength, formatChar));
    }).join(' ');
    return result
  }

  getSuggest() {
    // console.warn('call');
    const template = this.state.format;
    const research = /(\d+)\.(jpg|png)$/.exec(template);
    console.log('research', research);
    if (!research) return null;

    const end = research[1];
    const start = end > 200 ? end - 1 : 1;
    const filledChar = this.state.filled0 ? '0' : ''
    const replaceStr = `%${filledChar}${end.length}d.${research[2]}`;
    const suggetFormat = template.replace(research[0], replaceStr);
    return {
      format: suggetFormat,
      argument: {
        start,
        end
      }
    }
  }

  handleAcceptSugget(suggest) {
    const newState = Object.assign(this.state, suggest);
    this.setState(newState);
  }

  handleChangeFilled0(checked) {
    this.setState({filled0: checked});
  }

  render() {
    const suggest = this.getSuggest();
    return (
      <div className="table">
        <div className="row">
          <div className="cell format">format</div>
          <div className="cell format">
            <input type="text" value={this.state.format}
                   onChange={(e) => this.handlerChange('format', e)}/>
          </div>
        </div>
        <div className="row">
          <div className="cell argument">argument</div>
          <div className="cell argument">
            <input type="number" value={this.state.argument.start}
                   onChange={(e) => this.handlerChange('argument.start', e)}
            />
            ~
            <input type="number" value={this.state.argument.end}
                   onChange={(e) => this.handlerChange('argument.end', e)}
            />
          </div>
        </div>
        <div className="row">
          <div className="cell result">result</div>
          <div className="cell result">
            <input type="text" value={this.format()} readOnly id="format-text"/>
            <button onClick={this.handleCopy}>copy</button>
            {this.state.copyMessage}
          </div>
        </div>
        {suggest &&
         <div className="row">
           <div className="cell">suggest</div>
           <div className="cell">
             <button
               onClick={() => this.handleAcceptSugget(suggest)}>
               Accept
             </button>
             {suggest.format}
             <label className="filled-0-label">
               fill0
               <input
                 type="checkbox"
                 checked={this.state.filled0}
                 onChange={ e => this.handleChangeFilled0(e.target.checked) }
               />
             </label>
           </div>
        </div>}
      </div>
    )
  }
}

ReactDOM.render(
  <RootElement />,
  document.getElementById('root')
)
