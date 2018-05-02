/**
 * Created by huangw1 on 2018/5/2.
 */

/**
 * Created by huangw1 on 2018/5/2.
 */

const exec = require('child_process').exec
const chalk = require('chalk')
const commander = require('commander')
const yellow = chalk.yellow
const green = chalk.green
const red = chalk.red


const logger = {
	success(...params) {
		console.info(green(...params))
	},
	info(...params) {
		console.info(yellow(...params))
	},
	error(...params) {
		console.error(red(...params))
	},
	warn(...params) {
		console.warn(yellow(...params))
	}
}
exports.logger = logger


const promisify = (fn) => {
	return (...params) => {
		return new Promise((resolve, reject) => {
			fn(...params, (error, ...rest) => {
				if(error) {
					logger.error(error)
					return reject(error)
				}
				return resolve(...rest)
			})
		})
	}
}
exports.exec = promisify(exec)


const getCurrentTime = (date, separator) => {
	const addZero = (num) => {
		if (num < 10) {
			return '0' + num
		}
		return num
	}
	date = date || new Date()
	separator = separator || '-'
	const year = date.getFullYear()
	const month = addZero(date.getMonth() + 1)
	const day = addZero(date.getDate())
	return `${year}${separator}${month}${separator}${day}`
}
exports.getCurrentTime = getCurrentTime


const isCurrentBranch = async (name) => {
	const currentBranchCMD = 'git rev-parse --abbrev-ref HEAD'
	const branchName = await exports.exec(currentBranchCMD)
	return (branchName.trim() == name.trim())
}
exports.isCurrentBranch = isCurrentBranch

