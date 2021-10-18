const mongoose = require('mongoose');

const repairRequestSchema = new mongoose.Schema({
  contactInfo: {
    name: {
      type: String,
      required: [true, 'Inserte su nombre'],
    },
    phone: {
      type: String,
      required: [true, 'Inserte su número de telefono'],
      validate: {
        validator: function (v) {
          return /\d{13}/.test(v);
        },
        message: `:Nro no válido, siga el formato; 5492614608374`,
      },
    },
    address: {
      type: String,
    },
  },
  text: {
    type: String,
    required: [true, 'Escriba sobre el problema del dispositivo'],
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: [
      'pendiente',
      'presupuestando',
      'arreglando',
      'arreglado',
      'entregado',
      'sinArreglar',
    ],
    default: 'pendiente',
  },
  statusModifiedAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  ],
  statusId: {
    type: Number,
    default: 0,
  },
  modelo: {
    type: String,
    required: [
      true,
      'Necesita especificar el modelo del dispositivo a arreglar/instalar.',
    ],
  },
  nserie: {
    type: String,
  },
  npedido: {
    type: Number,
  },
  issuedBy: {
    type: String,
    required: [true, 'Nombre de quien completa el formulario'],
  },
});

const RepairRequest = mongoose.model('RepairRequest', repairRequestSchema);

module.exports = RepairRequest;
