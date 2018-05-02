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

/**
 * 日志打印
 */
const logger = {
	success(...params) {
		console.info(green(...params))
	},
	info(...params) {
		console.info(yellow(...params))
	},
	error(...params) {
		console.info(red(...params))
	}
}
exports.logger = logger

/**
 * 回调包装为 Promise
 * @param fn
 * @returns {function(...[*])}
 */
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

/**
 * 获取格式化时间
 * @param date
 * @param separator
 * @returns {string}
 */
const getCurrentTime = (date, separator) => {
	const addZero = (num) => {
		return Number(num) < 10? '0' + num: num
	}

	date = date || new Date()
	separator = separator || '-'
	const year = date.getFullYear()
	const month = addZero(date.getMonth() + 1)
	const day = addZero(date.getDate())
	return `${year}${separator}${month}${separator}${day}`
}
exports.getCurrentTime = getCurrentTime

/**
 * 是否为当前分支
 * @param name
 * @returns {Promise.<boolean>}
 */
const isCurrentBranch = async (name) => {
	const trim = (str) => {
		return String(str).trim()
	}

	const currentBranchCMD = 'git rev-parse --abbrev-ref HEAD'
	const branchName = await exports.exec(currentBranchCMD)
	return (trim(branchName) == trim(name))
}
exports.isCurrentBranch = isCurrentBranch

