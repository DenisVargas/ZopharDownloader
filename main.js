const makeRequest = require('./requests');
const args = process.argv;
//Los primeros 2 argumentos siempre son el path a node.exe y el path a este archivo.

//https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
if(args[2] === 'help'){
    helpMessage = `ZPmusic is a command line tool that allows you to download full albums from the Zhapar.net website.
    ZpMusic [url] [optional: downloadFolder]
    
    [url] Copy the link of a Zhopar.net Music Disc.
    Example: https://www.zophar.net/music/playstation2-psf2/nobunagas-ambition-iron-triangle
    
    [downloadFolder]	Default is ./download. By specifying a new folder, ZPMusic will check if the folder exists, if not a new one is created instead and all files are downloaded inside.
    
    Keep in mind that, somethimes some files takes more time to download than other ones, be patient.`;
    console.log(helpMessage);
}
else{
    var checkReg = /https:\/\/www\.zophar\.net\/music\//gm;
    if(checkReg.test(args[2])){
        console.log(`ZPMusic will download the contents in ${args[3] != null ? `${args[3]} folder` : 'default folder: ./download'}`);
        makeRequest(args[2], args[3] != null ? args[3] : './download');
    }
    else{
        console.log("Por favor ingresa una URL valida");
    }
}