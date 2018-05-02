/**
 * Created by huangw1 on 2018/5/2.
 */

/**
 * Created by huangw1 on 2018/5/2.
 */

const exec = require('child_process').exec
const chalk = require('chalk')
const commander = require('commander')

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

const isCurrentBranch = (name) => {
	const currentBranchCMD = 'git rev-parse --abbrev-ref HEAD'
	return new Promise((resolve, reject) => {
		exec(currentBranchCMD, (error, branchName) => {
			if (error) {
				console.error(chalk.red(error))
				return reject(error)
			}
			resolve(branchName.trim() == name.trim())
		})
	})
}

exports.getCurrentTime = getCurrentTime
exports.isCurrentBranch = isCurrentBranch

