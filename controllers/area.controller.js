const Area = require('../models/area.model');
const axios = require('axios');

module.exports.city = async (req, res) => {
  var data = null;
  await axios.get('https://thongtindoanhnghiep.co/api/city/27')
    .then(res => {
      data = res.data
    })
  res.send(data);
}
module.exports.district = async (req, res) => {
  var data = null;
  await axios.get('https://thongtindoanhnghiep.co/api/district/86/ward')
    .then(res => {
      data = res.data
    })
  res.send(data);
}