const fs = require('fs');
const path = require('path');

module.exports.oauthCallback = fs.readFileSync(path.join(__dirname, 'oauthCallback.gql'), 'utf8');
module.exports.project = fs.readFileSync(path.join(__dirname, 'project.gql'), 'utf8');
module.exports.publicProject = fs.readFileSync(path.join(__dirname, 'publicProject.gql'), 'utf8');
module.exports.projects = fs.readFileSync(path.join(__dirname, 'projects.gql'), 'utf8');
module.exports.mostRecentProject = fs.readFileSync(path.join(__dirname, 'mostRecentProject.gql'), 'utf8');
module.exports.synth = fs.readFileSync(path.join(__dirname, 'synth.gql'), 'utf8');
module.exports.synths = fs.readFileSync(path.join(__dirname, 'synths.gql'), 'utf8');
module.exports.user = fs.readFileSync(path.join(__dirname, 'user.gql'), 'utf8');
module.exports.me = fs.readFileSync(path.join(__dirname, 'me.gql'), 'utf8');
