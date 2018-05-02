/**
 * Created by huangw1 on 2018/5/2.
 */

/**
 * Created by huangw1 on 2018/5/2.
 */

const chalk = require('chalk')
const commander = require('commander')
const util = require('../util')
const pkg = require('../package.json')

const CREATE_DESC = 'input the branch name, then a branch like feature/{name}_{YYYY-MM-DD} will be created'
const CREATE_MISSING_PARAM = 'missing project name'

const isCurrentBranch = util.isCurrentBranch
const getCurrentTime = util.getCurrentTime
const logger = util.logger
const exec = util.exec


commander
	.version(pkg.version)
	.command('create <name>')
	.description(CREATE_DESC)
	.action(async (name) => {
		if (!name) {
			logger.error(CREATE_MISSING_PARAM)
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

		const result = await exec(execCMD)
		if(result) {
			logger.success(branchName)
		}
	})

commander.parse(process.argv)
if(commander.args.length === 0) {
	commander.help()
}

