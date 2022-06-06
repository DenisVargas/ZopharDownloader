const fs = require('fs');
const Path = require('path');
const request = require('request');
const events = require('events');

//https://betterprogramming.pub/using-events-in-node-js-part-2-50d26d817b26
var completedEvent = new events.EventEmitter();
var registerDownload = new events.EventEmitter();

//https://itnext.io/async-and-await-in-javascript-the-extension-to-a-promise-f4e0048964ac
async function SaveMp3File(filename, src, path = './'){
    var completeFilePath = Path.resolve(path, filename);
    //console.log(`Filepath for ${filename} is ${path}, Complete path generated is ${completeFilePath}`);
    registerDownload.emit('RegisterFile',filename);

    //https://nodesource.com/blog/understanding-streams-in-nodejs/
    //https://www.digitalocean.com/community/tutorials/how-to-work-with-files-using-the-fs-module-in-node-js
    //https://nodejs.org/en/knowledge/advanced/streams/how-to-use-stream-pipe/
    //https://stackoverflow.com/questions/32841580/downloading-mp3-file-from-remote-node-js
    //https://developer.mozilla.org/es/docs/Web/API/Blob
    //https://www.wikiwand.com/es/Binary_large_object
    request.get(src)
    .pipe(fs.createWriteStream(completeFilePath))
    .on('error', (err) => console.log(`An error ocurred/n${err}`))
    .on('finish', ()=>{        
        completedEvent.emit('FileDownloadCompleted',filename);
    });
}

//https://www.tutorialsteacher.com/nodejs/nodejs-module-exports
module.exports = {
    registerDownload,
    completedEvent,
    SaveMp3File
}


//https://stackoverflow.com/questions/3916191/download-data-url-file
//https://www.geeksforgeeks.org/how-to-trigger-a-file-download-when-clicking-an-html-button-or-javascript/