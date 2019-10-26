const fs = require('fs');
const path = require('path');

module.exports.audioClip = fs.readFileSync(path.join(__dirname, 'audioClip.gql'), 'utf8');
module.exports.audioClips = fs.readFileSync(path.join(__dirname, 'audioClips.gql'), 'utf8');
module.exports.midiClip = fs.readFileSync(path.join(__dirname, 'midiClip.gql'), 'utf8');
module.exports.midiClips = fs.readFileSync(path.join(__dirname, 'midiClips.gql'), 'utf8');
module.exports.oauthCallback = fs.readFileSync(path.join(__dirname, 'oauthCallback.gql'), 'utf8');
module.exports.project = fs.readFileSync(path.join(__dirname, 'project.gql'), 'utf8');
module.exports.projects = fs.readFileSync(path.join(__dirname, 'projects.gql'), 'utf8');
module.exports.mostRecentProject = fs.readFileSync(path.join(__dirname, 'mostRecentProject.gql'), 'utf8');
module.exports.synth = fs.readFileSync(path.join(__dirname, 'synth.gql'), 'utf8');
module.exports.synths = fs.readFileSync(path.join(__dirname, 'synths.gql'), 'utf8');
module.exports.user = fs.readFileSync(path.join(__dirname, 'user.gql'), 'utf8');
module.exports.me = fs.readFileSync(path.join(__dirname, 'me.gql'), 'utf8');
