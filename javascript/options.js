import React from 'react';
import ReactDOM from 'react-dom'

class RootElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoAry: []
    };
  }

  componentDidMount() {
    chrome.windows.getCurrent({
      populate: true,
    }, (cWindow) => {
      console.log(cWindow, chrome);
    });
  }

  render() {
    return (
      <div>
        root element
      </div>
    );
  }
}

ReactDOM.render(
  <RootElement />,
  document.getElementById('root')
)
