const Drawmon = require('../models/drawmon');
const DrawmonInstance = require('../models/drawmonInstance');
const Type = require('../models/type');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
  const numberOfDrawmons = await Drawmon.countDocuments();
  const numberOfDrawmonInstances = await DrawmonInstance.countDocuments();
  res.render('index', {
    title: 'Drawmon',
    number_of_drawmons: numberOfDrawmons,
    number_of_drawmon_instances: numberOfDrawmonInstances,
  });
});

// Display list of all drawmons.
exports.drawmon_list = asyncHandler(async (req, res, next) => {
  const allDrawmons = await Drawmon.find({}).populate('type').sort({ name: 1 });
  res.render('drawmon_list', { drawmon_list: allDrawmons });
});

// Display detail page for a specific drawmon.
exports.drawmon_detail = asyncHandler(async (req, res, next) => {
  const drawmon = await Drawmon.findById(req.params.id).populate('type').exec();

  res.render('drawmon_detail', {
    title: 'Drawmon detail',
    drawmon: drawmon,
  });
});

// Display drawmon create form on GET.
exports.drawmon_create_get = asyncHandler(async (req, res, next) => {
  const allTypes = await Type.find({}).sort({ name: 1 });
  res.render('drawmon_form', {
    title: 'Create Drawmon',
    allow_draw: 'true',
    type_list: allTypes,
  });
});

// Handle drawmon create on POST.
exports.drawmon_create_post = [
  // Convert the type to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.type)) {
      req.body.type =
        typeof req.body.type === 'undefined' ? [] : [req.body.type];
    }
    next();
  },
  // Validate and sanitize fields.
  body('name', 'Name must be specified').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('special_ability').escape(),
  body('image_data').optional({ values: 'falsy' }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a BookInstance object with escaped and trimmed data.
    const drawmon = new Drawmon({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      special_ability: req.body.special_ability,
      image_data: req.body.image_data,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allTypes = await Type.find({}).sort({ name: 1 });
      res.render('drawmon_form', {
        title: 'Create Drawmon',
        drawmon: drawmon,
        type_list: allTypes,
      });
      return;
    } else {
      // Data from form is valid
      await drawmon.save();
      res.redirect(drawmon.url);
    }
  }),
];

// Display drawmon delete form on GET.
exports.drawmon_delete_get = asyncHandler(async (req, res, next) => {
  const drawmon = await Drawmon.findById(req.params.id).populate('type').exec();
  const allDrawmonInstances = await DrawmonInstance.find({
    drawmon: req.params.id,
  })
    .sort({ name: 1 })
    .exec();

  res.render('drawmon_delete', {
    title: 'Drawmon detail',
    drawmon: drawmon,
    delete_drawmon: allDrawmonInstances.length > 0 ? undefined : 'true',
  });
});

// Handle drawmon delete on POST.
exports.drawmon_delete_post = asyncHandler(async (req, res, next) => {
  const drawmon = await Drawmon.findById(req.params.id).exec();
  if (drawmon === null) {
    // No results.
    const err = new Error('Drawmon not found');
    err.status = 404;
    return next(err);
  } else {
    await Drawmon.findByIdAndDelete(drawmon._id);
    res.redirect(`/catalog/drawmons`);
  }
});

// Display drawmon update form on GET.
exports.drawmon_update_get = asyncHandler(async (req, res, next) => {
  const [drawmon, allTypes] = await Promise.all([
    Drawmon.findById(req.params.id).exec(),
    Type.find({}).sort({ name: 1 }).exec(),
  ]);

  if (drawmon === null) {
    // No results.
    const err = new Error('Drawmon not found');
    err.status = 404;
    return next(err);
  }
  // Mark our selected genres as checked.
  allTypes.forEach((type) => {
    if (drawmon.type.includes(type._id)) type.checked = 'true';
  });

  res.render('drawmon_form', {
    title: 'Update Drawmon',
    drawmon: drawmon,
    type_list: allTypes,
    allow_draw: 'true',
  });
});

// Handle drawmon update on POST.
exports.drawmon_update_post = [
  // Convert the type to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.type)) {
      req.body.type =
        typeof req.body.type === 'undefined' ? [] : [req.body.type];
    }
    next();
  },
  // Validate and sanitize fields.
  body('name', 'Name must be specified').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('special_ability').escape(),
  body('image_data').optional({ values: 'falsy' }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const drawmon = new Drawmon({
      name: req.body.name,
      description: req.body.description,
      type: req.body.type,
      special_ability: req.body.special_ability,
      image_data: req.body.image_data,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      const allTypes = await Type.find({}).sort({ name: 1 });

      // Render form again with sanitized values and error messages.
      res.render('drawmon_form', {
        title: 'Update Drawmon',
        drawmon: drawmon,
        type_list: allTypes,
      });
      return;
    } else {
      // Data from form is valid
      const updatedDrawmon = await Drawmon.findByIdAndUpdate(
        req.params.id,
        drawmon,
        {}
      );
      res.redirect(updatedDrawmon.url);
    }
  }),
];
