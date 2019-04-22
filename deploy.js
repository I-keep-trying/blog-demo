const execSync = require('child_process').execSync

execSync('git status && git add . && git commit -m \"new stuff\" && git push -u origin master', { stdio: [0, 1, 2] })
