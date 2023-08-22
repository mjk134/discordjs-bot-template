import "dotenv/config";
import {
  Events,
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  REST,
  Routes,
} from "discord.js";
import fs from "fs";
import { info, error } from "./utils/logger.js";
import path from "path";
import { getGlobals } from "common-es";
// Since this is a module, we can use import.meta.url to get the current directory
const { __dirname } = getGlobals(import.meta.url);

const { TOKEN: token, CLIENT_ID: clientId, GUILD_ID: guildId } = process.env;

info("Initializing...");
// Client configuration goes here
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});
const commandFiles = fs
  .readdirSync(`${path.join(__dirname)}/commands`)
  .filter((file) => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync(`${path.join(__dirname)}/events`)
  .filter((file) => file.endsWith(".js"));
const interactionFiles = fs
  .readdirSync(`${path.join(__dirname)}/interactions`)
  .filter((file) => file.endsWith(".js"));
const commands = [];
const interactions = [];

// Collections are like Maps, but better
client.commands = new Collection();
client.interactions = new Collection();

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(token);
  try {
    if (!clientId) {
      error(
        "Client ID is not set in config.json",
        "failed to register commands.",
      );
    } else if (!guildId) {
      await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
      info("Successfully registered application commands globally.");
    } else {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      info(
        "Successfully registered application commands for development guild.",
      );
    }
  } catch (err) {
    if (err) error(err);
  }
}

/**
 * Deal with other interactions here
 * @param {import("discord.js").Interaction<import("discord.js").CacheType>} i
 */
async function otherInteractions(i) {
  // Logic for other interactions
  const interaction = client.interactions.get(i.customId);
  if (!interaction) return;
  try {
    await interaction.execute(i);
  } catch (err) {
    if (err) error(err);
    await i.reply({
      content: "There was an error while executing this interaction!",
      ephemeral: true,
    });
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return otherInteractions(interaction);
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    if (err) error(err);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

(async () => {
  info("Registering commands...");
  for (const file of commandFiles) {
    // ESM dynamic import
    const command = await import(`./commands/${file}`);
    commands.push(command.data.toJSON());
    info(`Registered command: ${command.data.name}`);
    client.commands.set(command.data.name, command);
  }
  info("Registered commands successfully!");

  info("Registering events...");
  for (const file of eventFiles) {
    const event = await import(`./events/${file}`);
    if (event.once) {
      client.once(event.event, (...args) => event.execute(...args, client));
    } else {
      client.on(event.event, (...args) => event.execute(...args, client));
    }
    info("Registered Event:", event.event);
  }
  info("Registered events successfully!");

  info("Registering interactions...");
  for (const file of interactionFiles) {
    const interaction = await import(`./interactions/${file}`);
    interactions.push(interaction);
    info(`Registered interaction: ${interaction.interactionId}`);
    client.interactions.set(interaction.interactionId, interaction);
  }
  info("Registered interactions successfully!");

  await registerCommands();
  await client.login(token);
})();
