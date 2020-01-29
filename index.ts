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

  const sha = core.getInput('sha') || github.context.sha
  const state = getRequiredInput('state') as ReposCreateStatusParams['state']
  const description = getRequiredInput('description')
  const context = getRequiredInput('context')
  const targetUrl = core.getInput('target_url')

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
