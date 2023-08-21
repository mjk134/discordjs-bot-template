import chalk from 'chalk';

export function info(...args) {
	console.log(chalk.magentaBright(new Date().toLocaleString()) + chalk.cyan(' :: INFO :: ') + chalk.green(`${args.join(' ')}`));
}

export function error(...args) {
	console.log(chalk.magentaBright(new Date().toLocaleString()) + chalk.red(' :: ERROR :: '), chalk.yellow(`${args.join(' ')}`));
}
