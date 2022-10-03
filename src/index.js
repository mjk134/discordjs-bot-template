const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { info, error } = require('./utils/logger');
const path = require('path');
const configRequire = require('./utils/configRequire');
const { token, guildId, clientId } = configRequire(`${path.join(__dirname)}/config.json`);

info('Initializing...');
const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
const commandFiles = fs.readdirSync(`${path.join(__dirname)}/commands`).filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync(`${path.join(__dirname)}/events`).filter(file => file.endsWith('.js'));
const commands = [];

client.commands = new Collection();

info('Registering commands...');
for (const file of commandFiles) {
	const command = require(`${path.join(__dirname)}/commands/${file}`);
	commands.push(command.data.toJSON());
	info(`Registered command: ${command.data.name}`);
	client.commands.set(command.data.name, command);
}
info('Registered commands successfully!');


info('Registering events...');
for (const file of eventFiles) {
	const event = require(`${path.join(__dirname)}/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
	info('Registered Event:', event.name);
}
info('Registered events successfully!');

async function registerCommands() {
	const rest = new REST({ version: '10' })
		.setToken(token);
	try {
		if (!clientId) {
			error('Client ID is not set in config.json', 'failed to register commands.');
		}
		else if (!guildId) {
			await rest.put(
				Routes.applicationCommands(clientId), {
					body: commands,
				},
			);
			info('Successfully registered application commands globally.');
		}
		else {
			await rest.put(
				Routes.applicationGuildCommands(clientId, guildId), {
					body: commands,
				},
			);
			info('Successfully registered application commands for development guild.');
		}
	}
	catch (err) {
		if (err) error(err);
	}
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return otherInteractions(interaction);
	const command = client.commands.get(interaction.commandName);
	if (!command) return;
	try {
		await command.execute(interaction);
	}
	catch (err) {
		if (err) error(err);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

async function otherInteractions(interaction) {
	// Logic for other interactions
}

registerCommands();
client.login(token);