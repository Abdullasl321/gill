const { DisconnectReason,
    useMultiFileAuthState,
 } = require("@whiskeysockets/baileys");

const makeWASocket = require("@whiskeysockets/baileys").default;


async function connectionLogic() {
    const { state, saveCreds } = await useMultiFileAuthState('session')

   const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
   });
sock.ev.on('connection.update', async(update) =>{

    const { connection, lastDisconnect, qr } = update || {};

    if(qr){
        console.log(qr);
        // write cutom logic over here
    }

    if (connection === 'close'){
        const shouldReconnect = 
        lastDisconnect?.error?.output?.statusCode != 
        DisconnectReason.loggedOut;

        if (shouldReconnect){
            connectionLogic();
        }
    }
});
    sock.ev.on('messages.upsert', (messageInfoUpsert) => {
        console.log(messageInfoUpsert);
    })
    sock.ev.on ('creds.update', saveCreds)

}

connectionLogic();