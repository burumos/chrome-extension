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
    );
  }
}

ReactDOM.render(
  <RootElement />,
  document.getElementById('root')
)
