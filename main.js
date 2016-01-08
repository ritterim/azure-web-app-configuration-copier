require('shelljs/global');
var args = require('minimist')(process.argv.slice(2));

// Note: The slot setting is not handled.

if (!which('azure')) {
  console.log('This script requires the Microsoft Azure Xplat-CLI.');
  exit(1);
}

if (!args.sourceApp) {
  console.log('Please provide a sourceApp parameter with the name of the Azure Web App.');
  exit(1);
}

if (!args.destApp) {
  console.log('Please provide a destApp parameter with the name of the Azure Web App.');
  exit(1);
}

// Use specified subscription, if specified.
// Otherwise, use current subscription.
var subscription = args.subscription || JSON.parse(exec(`azure account show --json`).output)[0].name;

console.log('--------------------------------------------------');
console.log('Begin copying appSettings');
console.log('--------------------------------------------------');

var appSettings = JSON.parse(exec(`azure site appsetting list "${args.sourceApp}" --subscription "${subscription}" --json`).output);

appSettings.forEach(x => {
  console.log(`Processing: "${x.name}"`);

  // Do we **need** to delete before adding?
  // Unsure if it will simply create a duplicate or replace.
  exec(`azure site appsetting delete "${x.name}" "${args.destApp}" --quiet --subscription "${subscription}"`);

  // Unsure if these nested quotes will cause a problem
  // If it does, we may need to not allow spaces in appSetting keys
  // or figure something else out.
  exec(`azure site appsetting add "${x.name}="\"${x.value}\""" "${args.destApp}" --subscription "${subscription}"`);
});

console.log('--------------------------------------------------');
console.log('Begin copying connectionStrings');
console.log('--------------------------------------------------');

var connectionStrings = JSON.parse(exec(`azure site connectionstring list "${args.sourceApp}" --subscription "${subscription}" --json`).output);

connectionStrings.forEach(x => {
  console.log(`Processing: "${x.name}"`);

  // Do we **need** to delete before adding?
  // Unsure if it will simply create a duplicate or replace.
  exec(`azure site connectionstring delete "${x.name}" "${args.destApp}" --quiet --subscription "${subscription}"`);

  // Hopefully just setting "Custom" here is OK.
  // The integers returned by `list` don't seem to match the expectations of `add`.
  exec(`azure site connectionstring add "${x.name}" "${x.connectionString}" "Custom" "${args.destApp}" --subscription "${subscription}"`);
});

console.log('--------------------------------------------------');
console.log();
console.log(`appSettings and connectionStrings have been synced from ${args.sourceApp} to ${args.destApp}.`);
