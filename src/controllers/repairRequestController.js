const RepairRequest = require('../models/repairRequestModel');
const AppError = require('../utils/appError');
const wrapAsync = require('../utils/wrapAsync');
const { automatedMessage } = require('./wspController');

// '/repairs/:id'

exports.getAll = wrapAsync(async (req, res) => {
  let searchQuery = {};
  if (req.query.search) searchQuery = { $text: { $search: req.query.search } };

  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach((el) => delete queryObj[el]);

  const currentPage = req.query.page ? req.query.page : 1;

  const documents = await RepairRequest.paginate(
    { ...searchQuery, ...queryObj },
    { page: currentPage, limit: 5, sort: { statusId: 1, sentAt: -1 } }
  );

  res.status(200).render('crm', {
    repairRequests: documents.docs,
    totalPages: documents.pages,
    currentPage,
    query: req.query,
  });
  /*
  if (documents)
    res.status(200).json({
      status: 'success',
      repairRequests: documents.docs,
      totalPages: documents.pages,
      currentPage: documents.page,
    });
  else
    res.status(404).json({
      status: 'fail',
      message: 'Not found',
    });
  */
});

exports.createNew = wrapAsync(async (req, res) => {
  const data = {
    contactInfo: {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    },
    issuedBy: req.body.issuedBy,
    modelo: req.body.modelo,
    nserie: req.body.nserie,
    text: req.body.text,
  };

  const repairRequest = await RepairRequest.create(data);

  automatedMessage(repairRequest);

  res.status(200).json({
    status: 'success',
    repairRequest,
  });
});

// '/repairs/:id'

exports.findRepairRequest = wrapAsync(async (req, _, next) => {
  const repairRequest = await RepairRequest.findById(req.params.id);

  // TODO: replace for 404 page
  if (!repairRequest) return next(new AppError('RepairRequest not found', 404));

  req.repairRequest = repairRequest;
  next();
});

exports.getOne = wrapAsync(async (req, res) => {
  // TODO: add error page to non existant rr
  res.status(200).render('repairRequest', {
    repairRequest: req.repairRequest,
  });
});

exports.modifyStatus = wrapAsync(async (req, res) => {
  req.repairRequest.status = req.body.status;
  await req.repairRequest.save();
  res.json(req.repairRequest);
});
