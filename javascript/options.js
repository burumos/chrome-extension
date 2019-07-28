import React from 'react';
import ReactDOM from 'react-dom'
import AceEditor from 'react-ace';
import chromeApi from './chromeApi';

import 'brace/mode/javascript';
import 'brace/theme/github';

class RootElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scripts: [],
      inputScript: {
        url: '',
        script: '',
      }
    };
    this.handleAddScriptRow = this.handleAddScriptRow.bind(this);
    this.handleUpdateScript = this.handleUpdateScript.bind(this);
    this.handleDeleteAllScripts = this.handleDeleteAllScripts.bind(this);
    this.handleDeleteScript = this.handleDeleteScript.bind(this);
  }

  componentDidMount() {
    // chrome.windows.getCurrent({
    //   populate: true,
    // }, (cWindow) => {
    //   console.log(cWindow, chrome);
    // });
    chromeApi.getFromStorage('scripts', result => {
      if (Array.isArray(result.scripts)) {
        this.setState({scripts: result.scripts});
      }
    })
  }

  handleAddScriptRow(newScript) {
    let copiedScripts = Array.apply(null, this.state.scripts);
    newScript.key = Date.now();
    this.setState({
      scripts: [newScript].concat(this.state.scripts),
      inputScript: {url: '', script: ''},
    });
    copiedScripts = [newScript].concat(copiedScripts);
    this.setState({scripts: copiedScripts});
    chromeApi.set2Strage({scripts: copiedScripts});
  }

  handleUpdateScript (newScript) {
    let copiedScripts = Array.apply(null, this.state.scripts);
    copiedScripts.forEach((script, index) => {
      if (script.key !== newScript.key) return;
      copiedScripts[index] = newScript;
      script.url = newScript.url;
      script.script = newScript.script;
    });
    this.setState({scripts: copiedScripts});
    chromeApi.set2Strage({scripts: copiedScripts});
  }

  handleDeleteAllScripts() {
    chromeApi.set2Strage({scripts: []}, (res) => {
      this.setState({scripts: []});
    })
  }

  handleDeleteScript(targetKey) {
    const newScripts = this.state.scripts.filter(
      (scriptObj) => scriptObj.key !== targetKey)
    this.setState({scripts: newScripts});
    chromeApi.set2Strage({scripts: newScripts});
  }

  render() {
    return (
      <div>
        <div><input type="button" value="Del All Scripts" onClick={this.handleDeleteAllScripts} /></div>
        <div className="table">
          <div className="row">
            <div className="cell">reset</div>
            <div className="cell">URL</div>
            <div className="cell">script</div>
            <div className="cell">save</div>
            <div className="cell">delete</div>
          </div>
          <OnlyInputScriptRow
            obj={this.state.inputScript}
            handleSave={this.handleAddScriptRow}
          />
          {this.state.scripts.map(
            obj => <ScriptRow
                     key={obj.key}
                     obj={obj}
                     handleSave={this.handleUpdateScript}
                     handleDelete={this.handleDeleteScript}
                   />)}
        </div>
      </div>
    );
  }
}

class ScriptRow extends React.Component {
  constructor(props) {
    super(props);
    const args = Object.assign(props);
    this.state = {
      url: props.obj.url,
      script: props.obj.script,
    };
    this.handleReset = this.handleReset.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleReset() {
    this.setState({
      url: this.props.obj.url,
      script: this.props.obj.script,
    })
  }

  handleSave() {
    this.props.handleSave({
      url: this.state.url,
      script: this.state.script,
      key: this.props.obj.key
    });
  }

  handleChange(propKey, value) {
    this.setState({[propKey]: value})
  }

  handleDelete() {
    this.props.handleDelete(this.props.obj.key);
  }

  render() {
    const canSave = this.state.url && this.state.script
          && this.state.url.trim() && this.state.script.trim()
          && (this.state.url !== this.props.obj.url
              || this.state.script !== this.props.obj.script);
    return (
      <div className="row">
        <div className="cell">
          <input type="button" value="RESET" onClick={this.handleReset} />
        </div>
        <div className="cell">
          <input
            className="url"
            type="text"
            value={this.state.url}
            onChange={(e) => this.handleChange('url', e.target.value)} />
        </div>
        <div className="cell">
          <AceEditor
            className="script"
            mode="javascript"
            theme="github"
            onChange={(value) => this.handleChange('script', value)}
            value={this.state.script}
            editorProps={{$blockScrolling: true}}
            width="500px"
            height="200px"
          />
        </div>
        <div className="cell">
          {canSave &&
           <input type="button" value="save" onClick={this.handleSave}/>
          }
        </div>
        <div className="cell">
          {this.props.obj.key && !canSave &&
           <input type="button" value="delete" onClick={this.handleDelete}/>
          }
        </div>
      </div>
    );
  }
}

class OnlyInputScriptRow extends ScriptRow {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }
  handleSave() {
    console.log(this.state);
    super.handleSave();
    this.setState({
      url: '',
      script: '',
    });
  }
}

ReactDOM.render(
  <RootElement />,
  document.getElementById('root')
)
