// Catches http requests from client-side mysimbdp-daas API calls and is part of mysimbdp-Tenantingest
require('axios');
const tenantRouter = require('express').Router()
require('dotenv').config()

const Tenant = require('./tenantModel.js');
const Agreement = require('./agreementModel.js');

tenantRouter.get('/:tenantId', async (request, response) => {
  const tenant = await Tenant.find({})
  response.json(tenant)
});


// Changed so it gets the document property tenantId, instead of datatbase document _id
tenantRouter.get('/:tenantId/:id', async (request, response) => {
  // const Tenant = await Tenant.findById(request.params.id)
  const tenant = await Tenant.findOne({ id: request.params.id });
  if (tenant) {
    response.json(tenant.toJSON())
  } else {
    response.status(404).end
  }
});

tenantRouter.get('/agreements', async (request, response) => {
  const agreement = await Agreement.find({})
  response.json(agreement)
});


tenantRouter.post('/:tenantId/', async (request, response) => {
  const body = request.body

  // Construct freeform_data by excluding tenantId
  const { tenantId: _, ...freeform_data } = body;

  const tenant = new Tenant({
    tenantId: body.tenantId,
    freeform_data: freeform_data
  });

  const savedTenant = await tenant.save()
  response.status(201).json(savedTenant)
});

tenantRouter.post('/agreements/', async (request, response) => {
  const body = request.body

  const agreement = new Agreement({
    tenantId: body.tenantId,
    data_file_constraints: body.data_file_constraints,
    service_agreement_constraints: body.service_agreement_constraints
  });

  const savedAgreement = await agreement.save()
  response.status(201).json(savedAgreement)
});


// Changed so it gets the document property id, instead of database document _id
tenantRouter.delete('/:tenantId/:id', async (request, response) => {
  // await Tenant.findByIdAndRemove(request.params.id)
  await Tenant.findOneAndRemove({ id: request.params.id })
  response.status(204).end()
});

module.exports = tenantRouter