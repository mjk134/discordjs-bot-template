// Export a constant interactionId that will be used to identify this interaction by the API.
export const interactionId = 'button';

// This is the function that will be called when the interaction is triggered.
export async function execute(interaction) {
	await interaction.reply({
		content: 'Button pressed!',
		ephemeral: true,
	});
}
