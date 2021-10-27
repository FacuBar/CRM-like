const axios = require('axios');

const commentForm = document.querySelector('#repairRequestComment');
const btnState = document.querySelector('.btn-state');
const btnRemove = document.querySelector('.btn-remove');
const repairStatus = document.querySelector('#repairStatus');

commentForm?.addEventListener('submit', async (e) => {
  const url = `/repairs/${window.location.pathname
    .split('/')
    .slice(-1)}/comments`;

  await axios.post(url, { text: commentForm.children[0].value });

  commentForm.children[0].value = '';

  setTimeout(location.reload(), 750);
});

btnState?.addEventListener('click', async (e) => {
  const statuses = [
    'pendiente',
    'presupuestando',
    'arreglando',
    'arreglado',
    'entregado',
    'sinArreglar',
  ];

  let status = repairStatus.innerHTML.split(' ')[0];
  let i = statuses.indexOf(status);
  const day = new Date(Date.now()).toLocaleString().split(',')[0];
  let text;

  if (i == statuses.length - 2) {
    status = statuses[0];
    text = `Dispositivo reingresado por reclamo el día: ${day}`;
  } else if (i == statuses.length - 1) {
    status = statuses[0];
    text = `Dispositivo reingresado el día: ${day}`;
  } else {
    status = statuses[i + 1];
    text = `Estatus modificado a ${status} el día ${day}`;
  }

  const url = `/repairs/${window.location.pathname.split('/').slice(-1)}`;

  axios.patch(url, { status });

  await axios.post(`${url}/comments`, {
    text,
  });

  setTimeout(location.reload(), 750);
});

btnRemove?.addEventListener('click', async (e) => {
  const url = `/repairs/${window.location.pathname.split('/').slice(-1)}`;

  const status = 'sinArreglar';
  axios.patch(url, { status });

  const day = new Date(Date.now()).toLocaleString().split(',')[0];
  const text = `Estatus modificado a ${status} el día ${day}`;
  await axios.post(`${url}/comments`, {
    text,
  });

  setTimeout(location.reload(), 750);
});
