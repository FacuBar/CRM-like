const QRCode = require('qrcode');
const wrapAsync = require('../utils/wrapAsync');
const { Client, MessageMedia } = require('whatsapp-web.js');

let client;

// Session data from wsp web
let sessionData = require('./session.json');
sessionData = JSON.parse(sessionData);

const puppeteerOptions = {
  headless: true,
  args: ['--no-sandbox'],
};

// Force connection to wsp
// Not the mos eficient way, but the hosting chosed by
// the customer can't make use of the better option |wsp multi-device|
const withSession = async () => {
  client = new Client({
    puppeteer: puppeteerOptions,
    session: sessionData,
  });

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  client.on('auth_failure', () => {
    console.log('It was not possible to connect to wsp, reconnecting ...');
    client.destroy();
    withSession();
  });

  await client.initialize();
};

withSession();

// returns promise
const sendMessage = (number, text) => {
  number = `${number}@c.us`;
  const message = text;
  return client.sendMessage(number, message);
};

exports.sendMsg = wrapAsync(async (req) => {
  const text = req.body.text.split(' ').slice(1).join(' ');

  sendMessage(req.RepairRequest.contactInfo.phone, text);
});

exports.automatedMessage = wrapAsync(async (repairRequest) => {
  let text;
  const url = `${process.env.URL}/crm/${repairRequest.id}`;
  const img = await QRCode.toDataURL(url);

  if (repairRequest.status === 'pendiente') {
    await sendMessage(
      repairRequest.contactInfo.phone,
      'Su equipo ha sido cargado correctamente, en breve recibirá un mensaje con el presupuesto y detalles de su reparación. Utilice el QR adjunto como comprobante de identidad al momento de retirarlo.'
    );

    const media = new MessageMedia('image/png', img.split(',')[1], 'qrcode');
    await sendMessage(repairRequest.contactInfo.phone, media);

    return;
  } else if (repairRequest.status === 'arreglando') {
    text =
      'Gracias por confiar en nosotros, una vez finalizada la reparación se lo haremos saber.';
  } else {
    text =
      'Le comunicamos que su equipo ha sido reparado, acérquese al local en el horario de atención para retirarlo. No olvide traer el código QR previamente enviado.';
  }

  await sendMessage(repairRequest.contactInfo.phone, text);
});
