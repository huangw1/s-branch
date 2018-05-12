/**
 * Created by huangw1 on 2018/5/2.
 */

/**
 * Created by huangw1 on 2018/5/2.
 */

const chalk = require('chalk')
const commander = require('commander')
const inquirer = require('inquirer')
const ora = require('ora')

const util = require('../util')
const pkg = require('../package.json')

const { isCurrentBranch, isBranchExit, getCurrentTime, getPinYin, symbol, logger, exec } = util
const { cyan } = chalk


commander
	.version(pkg.version)
	.command('create')
	.description('select a branch type and input a branch name, then a branch like {类型}_{花名}_{分支名}_{时间戳} will be created')
	.action(async () => {
		const { type, branch } = await inquirer.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'please select branch type?',
				choices: ['feature', 'bug']
			},
			{
				type: 'input',
				name: 'branch',
				message: 'please input branch name:',
			}
		])

		const masterName = 'master'
		const userNameCMD = 'git config --global user.name'
		const time = getCurrentTime()
		const userName = getPinYin(await exec(userNameCMD))
		const branchName = `${type.charAt(0)}_${userName}_${branch}_${time}`

		if(await isBranchExit(branch)) {
			return logger.error(`${symbol.error} there already had a same branch name`)
		}

		const checkoutMasterCMD = `git checkout ${masterName}`
		const createBranchCMD = `git checkout -b ${branchName}`
		const pushBranchCMD = `git push --set-upstream origin ${branchName}`
		const isMaster = await isCurrentBranch(masterName)
		const execCMD = isMaster? `${createBranchCMD} && ${pushBranchCMD}`: `${checkoutMasterCMD} && ${createBranchCMD} && ${pushBranchCMD}`

		const spinner = ora(cyan('')).start()
		try {
			await exec(execCMD)
		} finally {
			spinner.stop()
		}
		logger.success(`${symbol.success} already create ${branchName}`)
	})


commander
	.version(pkg.version)
	.command('delete <name>')
	.description('input a branch name, then a matched branch will be deleted')
	.action(async (name) => {

		let matchedBranch
		if(!(matchedBranch = await isBranchExit(name))) {
			return logger.error(`${symbol.error} there is not a matched branch name`)
		}

		const isCurrent = await isCurrentBranch(matchedBranch)
		if(isCurrent) {
			logger.info('being the current branch')
			logger.info('checkout master')

			const checkoutMasterCMD = 'git checkout master'
			await exec(checkoutMasterCMD)
		}

		const deleteRemoteBranchCMD = `git push -d origin ${matchedBranch}`
		const deleteBranchCMD = `git branch -d ${matchedBranch}`

		const spinner = ora(cyan('')).start()
		try {
			await exec(deleteRemoteBranchCMD)
			await exec(deleteBranchCMD)
		} finally {
			spinner.stop()
		}
		logger.success(`${symbol.success} already delete ${matchedBranch}`)
	})

commander.parse(process.argv)
if(commander.args.length === 0) {
	commander.help()
}

