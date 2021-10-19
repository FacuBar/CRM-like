const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Comment = require('./commentModel');
const { automatedMessage } = require('../controllers/wspController');

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
      ref: Comment,
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

// Midleware
repairRequestSchema.pre(/^findOne/, function (next) {
  this.populate('comments');
  next();
});

const statuses = [
  'pendiente',
  'presupuestando',
  'arreglando',
  'arreglado',
  'entregado',
  'sinArreglar',
];

const messageIf = ['pendiente', 'arreglando', 'arreglado'];

// sends automatic wsp msg when specified
repairRequestSchema.pre(
  'save',
  { document: true, query: false },
  function (next) {
    if (!this.isModified('status')) return next();

    this.statusModifiedAt = Date.now();

    this.statusId = statuses.indexOf(this.status);

    if (messageIf.includes(this.status)) automatedMessage(this);

    next();
  }
);

// Plugins
repairRequestSchema.plugin(mongoosePaginate);
repairRequestSchema.plugin(AutoIncrement, {
  inc_field: 'npedido',
  start_seq: 11450,
});

// Indexes
repairRequestSchema.index({
  modelo: 'text',
  nserie: 'text',
  npedido: 'text',
  'contactInfo.name': 'text',
  'contactInfo.phone': 'text',
});

module.exports = mongoose.model('RepairRequest', repairRequestSchema);
