const { info } = require('../utils/logger');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		info('Logged in as:', client.user.username);
		info('Ready!');
	},
};