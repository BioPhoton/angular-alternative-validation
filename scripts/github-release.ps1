$ErrorActionPreference = "Stop"

# release on git and npm

# Make a new GitHub release from git metadata based on your commit-convention. In this case angular convention
# source: https://github.com/conventional-changelog/conventional-github-releaser/blob/master/README.md
conventional-github-releaser -p $preset
Write-Host "created github release"  -foregroundcolor "green"

# publish new version on npm
cd .\dist
npm publish
Write-Host "published on npm :-)"  -foregroundcolor "green"
