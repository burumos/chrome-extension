import chromeApi from './chromeApi';

function evaluate(processString){
    return Function(processString)();
}

chromeApi.getFromStorage("scripts")
  .then(result => {
    if (Array.isArray(result.scripts)) {
      result.scripts.forEach(scriptObj => {
        if (! window.location.href.includes(scriptObj.url)
           || !scriptObj.onOff) return;
        let result = "";
        try {
          result = evaluate(scriptObj.script);
        } catch (error) {
          result = "ERROR: " + error.message;
        }
        scriptObj.execDate = (new Date).toString();
        scriptObj.result = result;
      })
    }
    chromeApi.set2Strage({scripts: result.scripts});
  });
