/**
 * Created by huangw1 on 2018/5/2.
 */

/**
 * Created by huangw1 on 2018/5/2.
 */

const chalk = require('chalk')
const commander = require('commander')
const ora = require('ora')

const util = require('../util')
const pkg = require('../package.json')

const isCurrentBranch = util.isCurrentBranch
const getCurrentTime = util.getCurrentTime
const logger = util.logger
const exec = util.exec
const cyan = chalk.cyan


commander
	.version(pkg.version)
	.command('create <name>')
	.description('input the branch name, then a branch like feature/{name}_{YYYY-MM-DD} will be created')
	.action(async (name) => {
		if (!name) {
			logger.error('missing project name')
			return null
		}

		const masterName = 'master'
		const isMaster = await isCurrentBranch(masterName)

		const time = getCurrentTime()
		const branchName = `feature/${name}_${time}`
		const checkoutMasterCMD = `git checkout ${masterName}`
		const createBranchCMD = `git checkout -b ${branchName}`
		const pushBranchCMD = `git push --set-upstream origin ${branchName}`
		const execCMD = isMaster? `${createBranchCMD} && ${pushBranchCMD}`: `${checkoutMasterCMD} && ${createBranchCMD} && ${pushBranchCMD}`

		const spinner = ora(cyan('')).start()
		await exec(execCMD)
		spinner.stop()
		logger.success(`already create ${branchName}`)
	})


commander
	.version(pkg.version)
	.command('delete <name>')
	.description('input the branch name, then a matched branch will be deleted')
	.action(async (name) => {
		if (!name) {
			logger.error('missing project name')
			return null
		}

		const listBranchCMD = 'git br'
		const regexp = new RegExp(`feature\/${name}\_\\d{4}\-\\d{2}-\\d{2}`, 'g')
		const branches = await exec(listBranchCMD)
		const branchList = branches.split('\n')
		const matchedBranches = []
		branchList.forEach((branch) => {
			let matched
			if((matched = branch.match(regexp)) != null) {
				matchedBranches.push(matched[0])
			}
		})
		if(!matchedBranches.length) {
			return logger.success('there is not a matched branch')
		}

		const matchedBranch = matchedBranches[0]
		const isCurrent = await isCurrentBranch(matchedBranch)
		if(isCurrent) {
			logger.info('being the current branch')
			logger.info('checkout master')

			const checkoutMasterCMD = 'git checkout master'
			exec(checkoutMasterCMD)
		}

		const deleteBranchCMD = `git branch -d ${matchedBranch}`
		const deleteRemoteBranchCMD = `git push -d origin ${matchedBranch}`

		const spinner = ora(cyan('')).start()
		await exec(deleteRemoteBranchCMD)
		await exec(deleteBranchCMD)
		spinner.stop()
		logger.success(`already delete ${matchedBranch}`)
	})

commander.parse(process.argv)
if(commander.args.length === 0) {
	commander.help()
}



