import React from 'react';
import ReactDOM from 'react-dom';
import chromeApi from './chromeApi';
import { copyFormats, copyFormatKey } from './constants';
import '../stylesheet/popup.scss';
import { TabList } from './popup/TabList';

const nicodoAutoStartKey = 'nicodoAutoStart';
const pixivKey = 'pixiv';

class RootElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nicodoAutoStart: null,
      pixiv: false,
      currentUrl: '',
    };
    this.handleNicodoAutoStart = this.handleNicodoAutoStart.bind(this);
    this.handleChangePixiv = this.handleChangePixiv.bind(this);
  }

  componentDidMount() {
    chromeApi.getFromStorage(nicodoAutoStartKey)
      .then(result => {
        this.setState({nicodoAutoStart: !!result[nicodoAutoStartKey]})
      })
    chromeApi.getFromStorage(pixivKey)
      .then(result => this.setState({pixiv: !!result[pixivKey]}));
    chromeApi.getCurrentTab()
      .then(tab => this.setState({ currentUrl: tab.url }));
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
    this.setState({nicodoAutoStart: checked});
    chromeApi.set2Strage({[nicodoAutoStartKey]: checked});
  }

  handleChangePixiv(e) {
    const checked = e.target.checked;
    this.setState({pixiv: checked});
    chromeApi.set2Strage({[pixivKey]: checked})
  }

  render () {
    const { currentUrl } = this.state;
    return (
      <div>
        <div className="main">
          <span id="bar" onClick={this.handleBar} >
            bar
          </span>
          {currentUrl && currentUrl.startsWith('https://www.nicovideo.jp/watch/')
           && <label className="nicodo-auto-start">
                {/* ニコ動自動再生 */}
                {decodeURI('%E3%83%8B%E3%82%B3%E5%8B%95%E8%87%AA%E5%8B%95%E5%86%8D%E7%94%9F')}
                <input type="checkbox"
                       onChange={this.handleNicodoAutoStart}
                       checked={!!this.state.nicodoAutoStart} />
              </label>
          }
          {currentUrl && currentUrl.startsWith('https://www.pixiv.net/')
           && (
             <label>
               pixiv auto scale
               <input type="checkbox"
                      onChange={this.handleChangePixiv}
                      checked={!!this.state.pixiv} />
             </label>
           )}
        </div>
        <TabList />
      </div>
    );
  }
}



ReactDOM.render(
  <RootElement />,
  document.getElementById('root')
)
