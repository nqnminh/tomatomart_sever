const mongoose = require('mongoose');

const areaSchema =  new mongoose.Schema({
    ward: String,
    hamlet: Array
})

const Area = mongoose.model('Area', areaSchema);

module.exports = Area;