$ErrorActionPreference = "Stop"

# rebuilds and test the latest verstion of the repository (a succeeded travis build is precondition)

# checks the status of the last build of the current repository
# --no-interactive disables the interactive mode
# source: https://github.com/travis-ci/travis.rb/blob/master/README.md
$state = travis status --no-interactive
echo $state
if ( $state -ne "passed")
{
    Write-Host "Invalid travis state $state. State should be passed"  -foregroundcolor "red"
    Exit
}
Write-Host "checked travis state" -foregroundcolor "green"
# deletes the node_modules folder (move them into trash, more reversable)
# trash node_modules
Write-Host "trashed node_modules" -foregroundcolor "green"
# pulls the latest version
git pull --rebase
Write-Host "git clean and up to date" -foregroundcolor "green"
