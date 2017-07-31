$ErrorActionPreference = "Stop"

# installs the node dependencies
# npm install
Write-Host "project setup done" -foregroundcolor "green"

# run unit tests
karma start karma.conf.js
Write-Host "run tests" -foregroundcolor "green"
