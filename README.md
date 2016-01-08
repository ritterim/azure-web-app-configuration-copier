# azure-web-app-configuration-copier

A tool to copy appSettings and connection strings between Azure Web Apps.

## Usage

- Install [Node.js](https://nodejs.org) *(if not already installed)*.
- `npm install -g azure-cli`
- `azure login`
- `git clone ...`
- `cd azure-web-app-configuration-copier`
- `npm install`
- `node main.js --sourceApp MySourceApp --destApp MyDestinationApp --subscription "My Subscription"`
  - If `--subscription` is not specified, it'll use the current subscription.

# License

[MIT](/LICENSE)
