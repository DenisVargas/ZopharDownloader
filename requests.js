const https = require('https');
const { JSDOM } = require('jsdom');
const sf = require('./SaveFile');
const fs = require('fs');

var CompUrlBreakDown = /(https?):\/\/(\S+)\/(.*)$/gm; // 1={Protocolo} 2={Dominio} 3={argumentos}
var portmatch = /:(\d{0,5})/gm;

var CanDownload = true;
//https://flexiple.com/javascript-dictionary/
var activeDownloads = {count:0}; //https://pietschsoft.com/post/2015/09/05/javascript-basics-how-to-create-a-dictionary-with-keyvalue-pairs

//Alternativa
//https://www.npmjs.com/package/superagent
var makeRequest = function(url, folder){
    //https://www.wikiwand.com/en/List_of_HTTP_header_fields
    var requestOptions = {        
        encoding:'utf8',
        method:'GET',
        url: url,
        accept:'text/html'
    }
    //https://stackoverflow.com/questions/6968448/where-is-body-in-a-nodejs-http-get-response
    //https://nodejs.org/docs/latest-v17.x/api/http.html#httpgeturl-options-callback
    //https://nodejs.org/en/knowledge/HTTP/clients/how-to-create-a-HTTP-request/
    https.get(url, requestOptions, (res)=>{
        //https://nodejs.org/es/docs/guides/anatomy-of-an-http-transaction/#request-body
        var data = '';
        res.on('data', (chunk)=>{
            data += chunk;
        });
        res.on('end',()=>{
            var dom = new JSDOM(data);            
            var doc = dom.window.document;            
            
            var trackList = doc.getElementById('tracklist').children[0];
            var tracks = trackList.children;
            var downloadFolder = folder;
            var urlToFiles = url.replace(/https:\/\/www.zophar.net\/music\//gm, 'https://fi.zophar.net/soundfiles/');
            
            fs.access(downloadFolder, (accesError) =>{
                //console.log(`Acces Error: ${accesError}`);
                if(accesError == null) {
                    console.log('Download folder is present and ready.');
                    startDownloading(tracks, urlToFiles, downloadFolder);
                    return;
                };
                
                if(accesError != null){
                    //Create the directory first https://nodejs.org/api/fs.html#fspromisesmkdirpath-options
                    console.log('Download folder is not ready yet...');
                    fs.mkdir(downloadFolder, (mkDirError)=>{
                        if(mkDirError != null) { 
                            console.log(`Could'nt create the Download folder, reason: ${mkDirError}`);
                        }
                        else {
                            console.log(`Directory ${downloadFolder} dindt existed, so a new directroy was created instead.`);
                            startDownloading(tracks, urlToFiles, downloadFolder);
                        };
                    });
                }
            });
            //return dom; //https://itnext.io/async-and-await-in-javascript-the-extension-to-a-promise-f4e0048964ac
        });
    });
}

function registerFileToDownload(filename){
    activeDownloads[filename] = true;
    activeDownloads.count++;
}

function markAsCompleted(filename) {
    activeDownloads[filename] = false;
    activeDownloads.count--;
    
    console.log(`File ${filename} has been downloaded, there's ${activeDownloads.count} tracks remaining`);
    
    // for (var key in activeDownloads) {
    //     if(key === 'count') continue;
    //     var value = activeDownloads[key];
    //     console.log(`File ${key} is in still in download: ${value}`);
    // }

    if(activeDownloads.count == 0){
        CanDownload = true;
        console.log("=================== Dowload completed ===================");
        activeDownloads = { count: 0 };
    }
}

function startDownloading(tracks, databaseRoot, downloadFolder){
    var extention = '.mp3';
    console.log(`Album has ${tracks.length} tracks...`);
    
    CanDownload = false;
    toDownload = tracks.length;
    sf.registerDownload.on('RegisterFile', registerFileToDownload);
    sf.completedEvent.on('FileDownloadCompleted', markAsCompleted);

    for(var i = 0; i < tracks.length; i++){
    //for(var i = 0; i < 1; i++){
        var track = tracks[i];
        if(track == undefined) continue;
        
        var trackProperties = track.children;
        if(trackProperties == undefined) {
            console.log("Track properties are invalid")
            continue;
        };
        
        // console.log(`Current index:${i} and element is ${tracks[i]}`);
        var trackName = trackProperties[1].innerHTML;
        var link = `${databaseRoot}/${trackName}${extention}`;
        sf.SaveMp3File(`${trackName}.mp3`, link, downloadFolder);
    }
}

module.exports = makeRequest;