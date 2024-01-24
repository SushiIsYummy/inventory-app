const Type = require('../models/type');
const Drawmon = require('../models/drawmon');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all types.
exports.type_list = asyncHandler(async (req, res, next) => {
  const allTypes = await Type.find({}).sort({ name: 1 });
  res.render('type_list', { type_list: allTypes });
});

// Display detail page for a specific type.
exports.type_detail = asyncHandler(async (req, res, next) => {
  const type = await Type.findById(req.params.id).exec();
  res.render('type_detail', {
    title: 'Type Detail',
    type: type,
  });
});

// Display type create form on GET.
exports.type_create_get = asyncHandler(async (req, res, next) => {
  res.render('type_form', { title: 'Create Type', allow_draw: 'true' });
});

// Handle type create on POST.
exports.type_create_post = [
  // Validate and sanitize fields.
  body('name', 'Type name must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const type = new Type({
      name: req.body.name,
      description: req.body.description,
      image_data: req.body.image_data,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.

      res.render('type_form', {
        title: 'Create Type',
        type: type,
      });
      return;
    } else {
      // Data from form is valid
      await type.save();
      res.redirect(type.url);
    }
  }),
];

// Display type delete form on GET.
exports.type_delete_get = asyncHandler(async (req, res, next) => {
  const type = await Type.findById(req.params.id).exec();
  const drawmonsWithType = await Drawmon.find(
    { type: req.params.id },
    { image_data: 0 }
  ).exec();
  res.render('type_delete', {
    title: 'Type Detail',
    type: type,
    delete_type: drawmonsWithType.length > 0 ? undefined : 'true',
  });
});

// Handle type delete on POST.
exports.type_delete_post = asyncHandler(async (req, res, next) => {
  const type = await Type.findById(req.params.id).exec();
  if (type === null) {
    // No results.
    const err = new Error('Drawmon not found');
    err.status = 404;
    return next(err);
  } else {
    await Type.findByIdAndDelete(type._id);
    res.redirect(`/catalog/types`);
  }
});

// Display type update form on GET.
exports.type_update_get = asyncHandler(async (req, res, next) => {
  const type = await Type.findById(req.params.id).exec();
  if (type === null) {
    // No results.
    const err = new Error('Drawmon not found');
    err.status = 404;
    return next(err);
  }

  res.render('type_form', {
    title: 'Update Type',
    type: type,
    allow_draw: 'true',
  });
});

// Handle type update on POST.
exports.type_update_post = [
  // Validate and sanitize fields.
  body('name', 'Type name must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const type = new Type({
      name: req.body.name,
      description: req.body.description,
      image_data: req.body.image_data,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.

      res.render('type_form', {
        title: 'Create Type',
        type: type,
      });
      return;
    } else {
      // Data from form is valid
      const updatedType = await Type.findByIdAndUpdate(req.params.id, type, {});
      res.redirect(updatedType.url);
    }
  }),
];
