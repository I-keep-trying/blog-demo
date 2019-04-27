//const moment = require('moment')
const execSync = require('child_process').execSync
//const dateTime = moment().format('MM/DD/YYYY HH:mm:ss')

//execSync(`git status && git add . && git commit -m \"new stuff ${dateTime}\" && git push -u origin master`, { stdio: [0, 1, 2] })

execSync(`git status && git add . && git commit -m \"new stuff April 27 1:00PM\" && git push -u origin master`, { stdio: [0, 1, 2] })
