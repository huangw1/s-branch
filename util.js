/**
 * Created by huangw1 on 2018/5/2.
 */

/**
 * Created by huangw1 on 2018/5/2.
 */

const exec = require('child_process').exec
const chalk = require('chalk')
const commander = require('commander')
const pinyin = require("pinyin")

const { blue, yellow, green, red } = chalk

/**
 * 日志打印
 */
const logger = {
	success(...params) {
		console.info(green(...params))
	},
	info(...params) {
		console.info(blue(...params))
	},
	error(...params) {
		console.info(red(...params))
	}
}
exports.logger = logger

/**
 * 状态
 */
const symbol = {
	info: blue('ℹ'),
	success: green('✔'),
	warning: yellow('⚠'),
	error: red('✖')
}
exports.symbol = symbol

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
					logger.error(error.message)
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
const getCurrentTime = (separator = '') => {
	const addZero = (num) => {
		return Number(num) < 10? '0' + num: num
	}

	const date = new Date()
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


/**
 * 获取汉字拼音
 * @param zch
 */
const getPinYin = (zch) => {
	const flat = (array) => {
		return array.reduce((arr, item) => {
			return arr.concat(Array.isArray(item)? flat(item): item)
		}, [])
	}
	return flat(pinyin(zch, { style: 0 })).filter(item => /\w+/.test(item)).join('')
}
exports.getPinYin = getPinYin

/**
 * 分支是否存在
 * @param name
 */
const isBranchExit = async (name) => {
	const listBranchCMD = 'git br'
	const regexp = new RegExp(`(f|b)_(\\w+)_${name}_\\d{8}`, 'g')
	const branches = await exports.exec(listBranchCMD)
	const branchList = branches.split('\n')
	const matchedBranches = []
	branchList.forEach((branch) => {
		let matched
		if((matched = branch.match(regexp)) != null) {
			matchedBranches.push(matched[0])
		}
	})
	return matchedBranches.length? matchedBranches[0]: ''
}
exports.isBranchExit = isBranchExit
