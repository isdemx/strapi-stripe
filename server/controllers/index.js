'use strict';

const configurationController = require('./configurationController');
const stripeController = require('./stripeController');
const checkoutController = require('./checkout'); // Новый контроллер

module.exports = {
  configurationController,
  stripeController,
  checkout: checkoutController, // Зарегистрируйте контроллер
};
