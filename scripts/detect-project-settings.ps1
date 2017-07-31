$ErrorActionPreference = "Stop"
$preset = (conventional-commits-detector)
# echo prints a value to screen
# ensures that a convention was detected
echo $preset
# Detect the recommended bump type by the conventional-commit standard
# source: https://github.com/conventional-changelog-archived-repos/conventional-recommended-bump/blob/master/README.md
# $bump stores the recommended bump type
$bump = (conventional-recommended-bump -p angular)
# echo prints a value to screen
# ensures that a bump type was detected
echo $bump
# npm version $bump bumps the version specified in $bump and write the new data back to package.json
# If you run npm version in a git repo, it will also create a version commit and tag.
# This behavior is disabled by --no-git-tag-version
# the var $bump specifies the segment of the version code to bump
Write-Host "created changelog $preset" -foregroundcolor "green"
