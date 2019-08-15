const fs = require('fs');
const path = require('path');

module.exports.createProject = fs.readFileSync(path.join(__dirname, 'createProject.gql'), 'utf8');
module.exports.updateProject = fs.readFileSync(path.join(__dirname, 'updateProject.gql'), 'utf8');
module.exports.createSynth = fs.readFileSync(path.join(__dirname, 'createSynth.gql'), 'utf8');
module.exports.updateSynth = fs.readFileSync(path.join(__dirname, 'updateSynth.gql'), 'utf8');
