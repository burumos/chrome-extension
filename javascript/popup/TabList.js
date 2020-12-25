import React from 'react';
import ReactDOM from 'react-dom';
import chromeApi from '../chromeApi';
import { copyFormats, copyFormatKey } from '../constants';
import { createCopiedUrl } from '../helper';

export class TabList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      tabs: {},
      someChecked: false,
      message: '',
      copyFormat: copyFormats.markdown.key,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClickCopy = this.handleClickCopy.bind(this);
    this.handleToggleAll = this.handleToggleAll.bind(this);
    this.handleChangeCopyFormat = this.handleChangeCopyFormat.bind(this);
  }

  componentDidMount() {
    chrome.tabs.query({currentWindow: true}, (result) => {
      console.log(result);
      result.forEach((tab) => tab.checked = false);
      this.setState({tabs: result});
    })
    chromeApi.getFromStorage(copyFormatKey)
      .then(result => {
        const copyFormat = result[copyFormatKey];
        if (copyFormat) {
          this.setState({copyFormat});
        }
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

  handleChangeCopyFormat(copyFormat) {
    chromeApi.set2Strage({[copyFormatKey]: copyFormat});
    this.setState({copyFormat});
  }

  render() {
    const copiedMDText = Object.values(this.state.tabs)
          .filter(tab => tab.checked)
          .map(tab => createCopiedUrl(tab.url, tab.title,
                                      this.state.copyFormat, true))
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
          <span>
            <SelectCopyFormat
              copyFormat={this.state.copyFormat}
              handleChangeCopyFormat={this.handleChangeCopyFormat}
            />
          </span>
          <button onClick={this.handleClickCopy}>Copy</button>
          <textarea readOnly value={copiedMDText} style={{ position: 'fixed', top: -10000 }}/>
          { this.state.message }
        </div>
        {Object.values(this.state.tabs)
         .map(tab => <TabItem tab={tab} handleChange={this.handleChange}/>)}
      </div>
    );
  }
}

function TabItem({ tab, handleChange  }) {
  return (
    <div key={tab.id} className="tab-row">
      <label>
        <input
          type="checkbox"
          checked={tab.checked}
          onChange={(e) => handleChange(e, tab.id)}
        />
        <span style={{ textOverflow: 'ellipsis' }}>{tab.title}</span>
      </label>
    </div>
  );
}


function SelectCopyFormat({copyFormat, handleChangeCopyFormat}) {
  return (
    <select
      onChange={e => handleChangeCopyFormat(e.target.value)}
      value={copyFormat}
    >
      {Object.values(copyFormats)
       .map(({key, name}) => (
         <option key={key} value={key}>
           {name}
         </option>
       ))}
    </select>
  );
}
