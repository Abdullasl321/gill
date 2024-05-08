const { Client, Location, Poll, List, Buttons, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
var qrimage = require('qr-image');
const fbDownloader = require('fb-video-downloader');


const client = new Client({
    authStrategy: new LocalAuth(),
    // proxyAuthentication: { username: 'username', password: 'password' },
    puppeteer: { 
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        headless: false
    },
    webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    //console.log('QR RECEIVED', qr);
    
    qrcode.generate(qr, {small : true});
    var qr_svg = qrimage.image(qr, { type: 'png' });
    qr_svg.pipe(require('fs').createWriteStream('i_love_qr.png'));
 
    
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
    

});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
    
});

client.on('ready', () => {
    console.log('READY');
    
});

client.on('message', async msg => {
    //console.log('MESSAGE RECEIVED', msg);

   // Check if message starts with 'fb '
   if (msg.body.startsWith('fb ')) {
    try {
        // Extract URL from the message
        const url = msg.body.slice(3);
        
        // Get video info using fb-video-downloader
        const info = await fbDownloader.getInfo(url);
        
        // Get direct video URL
        const directUrl = fbDownloader.getURL(info);
        
        // Send the video to the user
        const media = await MessageMedia.fromUrl(directUrl);
        await client.sendMessage(msg.from, media, {sendMediaAsDocument: true});
    } catch (error) {
        console.error('Error:', error.message);
        // Send error message to user
        await msg.reply('Error occurred while processing the video.');
    }
} 
    

});

client.on('message_create', async (msg) => {

    if (msg.body.toLowerCase().startsWith('alive')){
        msg.reply(`🙃 *𝙸𝚖 𝚊𝚕𝚒𝚟𝚎*  😏\n        ×| ɴᴏᴛ ᴅᴇᴀᴅ |× \n\nᴍ •ᴘʜ@ᴇɴɪx ᴍᴅ•`)
    msg.react('😉');
    const media = await MessageMedia.fromFilePath('./sticker/alive.jpg');
        await client.sendMessage(msg.from, media, {sendMediaAsSticker: true, stickerAuthor: `ᴍ •ᴘʜ@ᴇɴɪx ᴍᴅ•`, stickerName: `ALIVE` });
    } else if (msg.body.toLowerCase().startsWith('simg')){
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const media = await quotedMsg.downloadMedia();
            await client.sendMessage(msg.from, media);
        } else {
            msg.reply('ERROR 404');
        }
    } else if (msg.body.toLowerCase().startsWith('s')){
        const quotedMsg = await msg.getQuotedMessage();
        if (quotedMsg.hasMedia) {
            const media = await quotedMsg.downloadMedia();
            await client.sendMessage(msg.from, media, {sendMediaAsSticker: true, stickerAuthor: `ᴍ •ᴘʜ@ᴇɴɪx ᴍᴅ•`, stickerName: msg.from});
        } else {
            msg.reply('ERROR 404');
        }
    }
});