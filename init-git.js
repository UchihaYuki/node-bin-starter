const shell = require('shelljs')
const process = require('process');

if (process.argv.length != 3)
{
    console.log("Usage: node init-git.js https://github.com/<owner>/<repo>.git")
    return;
}

shell.rm('-rf', '.git');
shell.exec('git init');
shell.exec(`git remote add origin ${process.argv[2]}`);
shell.exec(`git add .`)
shell.exec(`git commit -m "first commit"`)
shell.exec(`git push -u -f origin master`)
