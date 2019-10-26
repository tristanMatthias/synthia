const fs = require('fs');
const path = require('path');

module.exports.createAudioClip = fs.readFileSync(path.join(__dirname, 'createAudioClip.gql'), 'utf8');
module.exports.updateAudioClip = fs.readFileSync(path.join(__dirname, 'updateAudioClip.gql'), 'utf8');
module.exports.createAudioTrack = fs.readFileSync(path.join(__dirname, 'createAudioTrack.gql'), 'utf8');
module.exports.updateAudioTrack = fs.readFileSync(path.join(__dirname, 'updateAudioTrack.gql'), 'utf8');
module.exports.createMidiClip = fs.readFileSync(path.join(__dirname, 'createMidiClip.gql'), 'utf8');
module.exports.updateMidiClip = fs.readFileSync(path.join(__dirname, 'updateMidiClip.gql'), 'utf8');
module.exports.createMidiTrack = fs.readFileSync(path.join(__dirname, 'createMidiTrack.gql'), 'utf8');
module.exports.updateMidiTrack = fs.readFileSync(path.join(__dirname, 'updateMidiTrack.gql'), 'utf8');
module.exports.createProject = fs.readFileSync(path.join(__dirname, 'createProject.gql'), 'utf8');
module.exports.updateProject = fs.readFileSync(path.join(__dirname, 'updateProject.gql'), 'utf8');
module.exports.createSynth = fs.readFileSync(path.join(__dirname, 'createSynth.gql'), 'utf8');
module.exports.updateSynth = fs.readFileSync(path.join(__dirname, 'updateSynth.gql'), 'utf8');
