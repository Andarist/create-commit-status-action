# create-commit-status-action

A simple GitHub action that create a commit status using the GitHub API.

## Example

```yml
name: Lighthouse

on:
  repository_dispatch:
    types: [check_lighthouse]

jobs:
  lighthouse:
    runs-on: ubuntu-latest

    steps:
      - name: Audit URLs using Lighthouse
        uses: treosh/lighthouse-ci-action@v2
        with:
          urls: |
            http://example.com/${{ github.event.client_payload.branch }}/

      - name: Save results
        uses: actions/upload-artifact@v1
        with:
          name: lighthouse-results
          path: .lighthouseci

      - name: Post results
        uses: ./.github/actions/report-commit-status
        with:
          state: success
          description: Lighthouse results have been uploaded
          context: lighthouse-results
          sha: ${{ github.event.client_payload.sha }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
