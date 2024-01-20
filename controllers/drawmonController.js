const Drawmon = require('../models/drawmon');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
  res.render('index', {
    title: 'Drawmon',
  });
});

// Display list of all drawmons.
exports.drawmon_list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: drawmon list');
});

// Display detail page for a specific drawmon.
exports.drawmon_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: drawmon detail: ${req.params.id}`);
});

// Display drawmon create form on GET.
exports.drawmon_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: drawmon create GET');
});

// Handle drawmon create on POST.
exports.drawmon_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: drawmon create POST');
});

// Display drawmon delete form on GET.
exports.drawmon_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: drawmon delete GET');
});

// Handle drawmon delete on POST.
exports.drawmon_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: drawmon delete POST');
});

// Display drawmon update form on GET.
exports.drawmon_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: drawmon update GET');
});

// Handle drawmon update on POST.
exports.drawmon_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: drawmon update POST');
});
