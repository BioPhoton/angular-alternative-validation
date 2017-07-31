# create version bump

# npm version $bump bumps the version specified in $bump and write the new data back to package.json
# -m will set a commit message with the version placed by %s
cd .\src
npm --no-git-tag-version version $bump
git add .\package.json
git commit -m "chore(release): $version ($bump)"
git tag $version
cd ..
# pushed the commit
# --follow-tags also pushed the new tags
# source: https://git-scm.com/docs/git-push
git push --follow-tags
Write-Host "pushed repo" -foregroundcolor "green"
