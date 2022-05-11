const chalk = require('chalk');

function info(...args) {
	console.log(chalk.magentaBright(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + chalk.cyan(' :: INFO :: ') + chalk.green(`${args.join(' ')}`));
}

function error(...args) {
	console.log(chalk.magentaBright(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')), chalk.red(' :: ERROR :: '), chalk.yellow(`${args.join(' ')}`));

}

module.exports = {
	info: info,
	error: error,
};