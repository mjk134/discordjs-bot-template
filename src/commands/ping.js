import {
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with pong");

export async function execute(interaction) {
  const ping = new ButtonBuilder()
    .setCustomId("button")
    .setLabel("Ping!")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(ping);

  await interaction.reply({
    content: "Pong",
    ephemeral: true,
    components: [row],
  });
}
