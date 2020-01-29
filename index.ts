import * as core from '@actions/core'
import * as github from '@actions/github'
import { ReposCreateStatusParams } from '@octokit/rest'

const getRequiredInput = (name: string): string =>
  core.getInput(name, { required: true })
;(async () => {
  let githubToken = process.env.GITHUB_TOKEN

  if (!githubToken) {
    core.setFailed(
      'Please add the `GITHUB_TOKEN` to the report commit status action.',
    )
    return
  }

  const octokit = new github.GitHub(githubToken)

  await octokit.repos.createStatus({
    ...github.context.repo,
    sha: core.getInput('sha') || github.context.sha,
    state: getRequiredInput('state') as ReposCreateStatusParams['state'],
    description: getRequiredInput('description'),
    context: getRequiredInput('context'),
    ...{ target_url: getRequiredInput('target_url') },
  })

  console.log('Successfully posted a GitHub commit status.')
})().catch(error => {
  console.error(error)
  core.setFailed(error.message)
})
