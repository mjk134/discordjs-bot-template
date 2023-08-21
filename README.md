# discordjs-bot-template
A simple discord bot template using discord.js.

## Installation
1. Create a repository from this template `OR` clone this repository.
2. Use your favourite package manager (Yarn is recommended) to install the dependencies, `npm install` or `yarn`.
3. Run `npm start` or `yarn start` to start the bot.

## Configuration
1. Create a `.env` file in the root directory of the project.
2. Add the following variables to the `.env` file:
```
TOKEN=your-bot-token
CLIENT_ID=your-bot-client-id
GUILD_ID=your-guild-id # Optional but is required for easy testing of slash commands.
```

## Usage
### Slash Commands
1. To create a slash command, create a new file in the `commands` directory.
2. Use this code to get started:
```js
import { SlashCommandBuilder } from 'discord.js';

// This is required export for the main file to import the command.
export const data = new SlashCommandBuilder()
	.setName('name')
	.setDescription('description');

export async function execute(interaction) {
    // Slash command response goes here.
}
```
3. The command should be registered every time the bot is started.

### Events
1. To create an event, create a new file in the `events` directory.
2. Here is an example:
```js
import { Events } from 'discord.js';

export const event = Events.YourEventName; // The event name. Refer to the discord.js documentation for more info.
export const once = true; // Whether the event should only be executed once, when recieved.
export async function execute(client) {
    // Event code goes here.
}
```
### Interactions
1. To create an interaction, create a new file in the `interactions` directory.
2. Here is an example:
```js
export const interactionId = 'ID'; // The interaction id you gave when registering the interaction.
export async function execute(interaction) {
    // Interaction response code goes here.
}
```

## Helpful Links
- [Discord.js Guide](https://discordjs.guide/)
- [Discord.js Documentation](https://discord.js.org/#/docs/main/stable/general/welcome)
- [Discord.js Discord Server](https://discord.gg/djs)
- [Discord Developer Portal](https://discord.com/developers/applications)
