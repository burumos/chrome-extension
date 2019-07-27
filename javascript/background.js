
chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);
  if (command === 'open_options') {
    chrome.runtime.openOptionsPage();
  }
});
