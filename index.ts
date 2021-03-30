import * as core from '@actions/core'
import * as github from '@actions/github'

type StatusState = 'error' | 'failure' | 'pending' | 'success'

const getRequiredInput = (name: string): string =>
  core.getInput(name, { required: true })
;(async () => {
  const sha = core.getInput('sha') || github.context.sha
  const state = getRequiredInput('state') as StatusState
  const description = core.getInput('description')
  const context = getRequiredInput('context')
  const targetUrl = core.getInput('target_url')
  const githubToken = core.getInput('github_token')

  const octokit = new github.GitHub(githubToken)
  await octokit.repos.createStatus({
    ...github.context.repo,
    sha,
    state,
    description,
    context,
    ...(targetUrl && { target_url: targetUrl }),
  })

  console.log('Successfully posted a GitHub commit status.')
})().catch(error => {
  console.error(error)
  core.setFailed(error.message)
})
