import React from 'react';
import ReactDOM from 'react-dom';
import chromeApi from './chromeApi';
import '../stylesheet/popup.scss';

const nicodoAutoStartKey = 'nicodoAutoStart';

class RootElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nicodoAutoStart: null,
    };
    this.handleNicodoAutoStart = this.handleNicodoAutoStart.bind(this);
  }

  componentDidMount() {
    chromeApi.getFromStorage(nicodoAutoStartKey)
      .then(result => {
        this.setState({nicodoAutoStart: !!result[nicodoAutoStartKey]})
      })
  }

  // handleOption() {
  //   if (chrome.runtime.openOptionsPage) {
  //     chrome.runtime.openOptionsPage();
  //   } else {
  //     window.open(chrome.runtime.getURL('options.html'));
  //   }
  // }

  handleBar() {
    window.open(chrome.runtime.getURL('bar.html'));
  }

  handleNicodoAutoStart(e) {
    const checked = e.target.checked;
    this.setState({[nicodoAutoStartKey]: checked});
    chromeApi.set2Strage({nicodoAutoStart: checked});
  }

  render () {
    return (
      <div>
        <div className="main">
          <span id="bar" onClick={this.handleBar} >
            bar
          </span>
          <label className="nicodo-auto-start">
            ニコ動自動再生
            <input type="checkbox"
                   onChange={this.handleNicodoAutoStart}
                   checked={!!this.state.nicodoAutoStart} />
          </label>
        </div>
        <TabsLists/>
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
      someChecked: false,
      message: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClickCopy = this.handleClickCopy.bind(this);
    this.handleToggleAll = this.handleToggleAll.bind(this);
  }

  componentDidMount() {
    chrome.tabs.query({currentWindow: true}, (result) => {
      // this.setState({message: JSON.stringify(result)});
      result.forEach((tab) => tab.checked = false);
      this.setState({tabs: result});
    })
  }

  handleChange(e, id) {
    const newTabs = Object.assign(this.state.tabs);
    let someChecked = false;
    Object.keys(newTabs).forEach(index => {
      const tab = newTabs[index];
      if (tab.id === id) {
        tab.checked = e.target.checked;
      }
      someChecked = someChecked || tab.checked;
    });
    this.setState({tabs: newTabs, someChecked});
  }

  handleClickCopy(e) {
    e.target.nextSibling.select();
    document.execCommand('copy');
    this.setState({message: "copied to clipboard!!"})
    window.setTimeout(() => this.setState({message: ''}), 1500)
  }

  handleToggleAll(checked) {
    const newTabs = Object.assign({}, this.state.tabs);
    Object.keys(newTabs).forEach(index => {
      const tab = newTabs[index];
      tab.checked = checked;
    });
    this.setState({
      tabs: newTabs,
      someChecked: checked,
    });
  }

  render() {
    const copiedMDText = Object.values(this.state.tabs)
          .filter(tab => tab.checked)
          .map(tab => `- [${tab.title}](${tab.url})`)
          .join("\n");
    return (
      <div className="tabs-frame">
        <div className="tab-row">
          TABS
          <label className="toggleLabel">
            toggle:
            <input
              type="checkbox"
              checked={ this.state.someChecked }
              onChange={ e => this.handleToggleAll(e.target.checked) }
            />
          </label>
          <button onClick={this.handleClickCopy}>MD Copy</button>
          <textarea readOnly value={copiedMDText} style={{ position: 'fixed', top: -10000 }}/>
          { this.state.message }
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
