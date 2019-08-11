import React from 'react';
import ReactDOM from 'react-dom';
import chromeApi from './chromeApi';

const optionButton = document.querySelector('#options');
const barButton = document.getElementById('bar');

optionButton.addEventListener('click', () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

barButton.addEventListener('click', () => {
  window.open(chrome.runtime.getURL('bar.html'));
});


class RootElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scripts: [],
    };
  }

  componentDidMount() {
    chromeApi.getFromStorage('scripts', result => {
      if (Array.isArray(result.scripts)) {
        this.setState({scripts: result.scripts});
      }
    });
  }

  render () {
    return (
      <div>
        <TabsLists/>
        <div className="table">
          <div className="row">
            <div className="cell">key</div>
            <div className="cell">url</div>
            <div className="cell">execute date</div>
            <div className="cell">result</div>
          </div>
          {this.state.scripts.map(
            scriptObj =>
              <div key={scriptObj.key} className="row">
                <div className="cell">{scriptObj.key}</div>
                <div className="cell">{scriptObj.url}</div>
                <div className="cell">{scriptObj.execDate}</div>
                <div className="cell">{scriptObj.result}</div>
              </div>)}
        </div>
      </div>
    );
  }
}

class TabsLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      tabs: {},
      message: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClickCopy = this.handleClickCopy.bind(this);
  }

  componentDidMount() {
    chrome.tabs.query({currentWindow: true}, (result) => {
      this.setState({message: JSON.stringify(result)});
      result.forEach((tab) => tab.checked = true);
      this.setState({tabs: result});
    })
  }

  handleChange(e, id) {
    const newTabs = Object.assign(this.state.tabs);
    Object.keys(newTabs).forEach(index => {
      const tab = newTabs[index];
      if (tab.id === id) {
        tab.checked = e.target.checked;
      }
    });
    this.setState({tabs: newTabs});
  }

  handleClickCopy(e) {
    e.target.nextSibling.select();
    document.execCommand('copy');
  }

  render() {
    const copiedMDText = Object.values(this.state.tabs)
          .filter(tab => tab.checked)
          .map(tab => `- (${tab.title})[${tab.url}]`)
          .join("\n");
    return (
      <div className="tabs-frame">
        <div className="tab-row">
          TABS
          <button onClick={this.handleClickCopy}>MD Copy</button>
          <textarea readOnly value={copiedMDText} style={{ position: 'fixed', top: -10000 }}/>
        </div>
        {Object.values(this.state.tabs).map(tab => {
          return (
            <div key={tab.id} className="tab-row">
              <label>
                <input type="checkbox" checked={tab.checked} onChange={(e) => this.handleChange(e, tab.id)} />
                <span>{tab.title}</span>
              </label>
            </div>
          )
        })}
      </div>
    );
  }
}

ReactDOM.render(
  <RootElement />,
  document.getElementById('root')
)
