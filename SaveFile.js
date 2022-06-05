const fs = require('fs');
const Path = require('path');
const request = require('request');
const events = require('events');

var completedEvent = new events.EventEmitter();
var registerDownload = new events.EventEmitter();

async function SaveMp3File(filename, src, path = './'){
    var completeFilePath = Path.resolve(path, filename);
    //console.log(`Filepath for ${filename} is ${path}, Complete path generated is ${completeFilePath}`);
    registerDownload.emit('RegisterFile',filename);
    request.get(src)
    .pipe(fs.createWriteStream(completeFilePath))
    .on('error', (err) => console.log(`An error ocurred/n${err}`))
    .on('finish', ()=>{
        completedEvent.emit('FileDownloadCompleted',filename);
    });
}

module.exports = {
    registerDownload,
    completedEvent,
    SaveMp3File
}