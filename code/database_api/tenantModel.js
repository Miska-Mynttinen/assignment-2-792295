const mongoose = require('mongoose')

const tenantSchema = new mongoose.Schema({
    tenantId: String,
});

tenantSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Tenant', tenantSchema)