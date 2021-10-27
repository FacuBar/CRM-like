const axios = require('axios');
const { showAlert } = require('./alerts');

const formInfo = document.querySelectorAll('.form-info');

const submitBtn = document.querySelector('#submit-btn');

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();

  handleForm();
});

const handleForm = () => {
  const repairRequest = {
    name: formInfo[0].value,
    phone: formInfo[1].value,
    address: formInfo[2].value,

    issuedBy: formInfo[3].value,

    modelo: formInfo[4].value,
    nserie: formInfo[5].value,
    text: formInfo[6].value,
  };

  sendRepairRequest(repairRequest);
};

const sendRepairRequest = async (repairRequest) => {
  try {
    const res = await axios.post('/repairs', repairRequest);

    if (res.data.status === 'success') {
      formInfo.forEach((form) => (form.value = ''));

      showAlert('success', 'Mensaje Enviado correctamente');
    }
  } catch (err) {
    const errMsg = err.response.data.message.split(':').slice(-1);
    showAlert('error', errMsg);
  }
};
