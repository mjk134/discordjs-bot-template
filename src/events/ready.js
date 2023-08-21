import { Events } from 'discord.js';
import { info } from '../utils/logger.js';

export const event = Events.ClientReady;
export const once = true;
export async function execute(client) {
	info('Logged in as:', client.user.username);
	info('Ready!');
}
