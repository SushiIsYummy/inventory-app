const DrawmonInstance = require('../models/drawmonInstance');
const Drawmon = require('../models/drawmon');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all drawmoninstances.
exports.drawmoninstance_list = asyncHandler(async (req, res, next) => {
  const allDrawmonInstancesGrouped = await DrawmonInstance.aggregate([
    {
      $lookup: {
        from: 'drawmons',
        localField: 'drawmon',
        foreignField: '_id',
        as: 'drawmon',
      },
    },
    {
      $group: {
        _id: { name: '$drawmon.name', image_data: '$drawmon.image_data' },
        instances: { $push: '$$ROOT' },
      },
    },
    { $project: { 'instances.drawmon': 0 } },
  ]);

  const allDrawmons = await Drawmon.find({});

  res.render('drawmoninstance_list', {
    drawmoninstance_list: allDrawmonInstancesGrouped,
    drawmon_list: allDrawmons,
  });
});

// Display detail page for a specific drawmoninstance.
exports.drawmoninstance_detail = asyncHandler(async (req, res, next) => {
  const drawmonInstance = await DrawmonInstance.findById(req.params.id)
    .populate('drawmon')
    .exec();

  res.render('drawmoninstance_detail', {
    title: 'Drawmon instance Detail',
    drawmon_instance: drawmonInstance,
  });
});

// Display drawmoninstance create form on GET.
exports.drawmoninstance_create_get = asyncHandler(async (req, res, next) => {
  const allDrawmons = await Drawmon.find().sort({ name: 1 }).exec();

  res.render('drawmoninstance_form', {
    title: 'Create Drawmon instance',
    drawmon_list: allDrawmons,
  });
});

// Handle drawmoninstance create on POST.
exports.drawmoninstance_create_post = [
  body('personal_name', 'Name must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('background_info').trim().isLength({ max: 100 }).escape(),
  body('likes').trim().isLength({ max: 100 }).escape(),
  body('dislikes').trim().isLength({ max: 100 }).escape(),
  body('hobbies').trim().isLength({ max: 100 }).escape(),
  body('other_info').trim().isLength({ max: 200 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const drawmonId = JSON.parse(req.body.selected_drawmon)[0];

    const drawmonInstance = new DrawmonInstance({
      personal_name: req.body.personal_name,
      background_info: req.body.background_info,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      hobbies: req.body.hobbies,
      other_info: req.body.other_info,
      drawmon: drawmonId,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      res.render('drawmoninstance_form', {
        title: 'Create Drawmon instance',
        drawmon_instance: drawmonInstance,
      });
      return;
    } else {
      // Data from form is valid
      await drawmonInstance.save();
      res.redirect(drawmonInstance.url);
    }
  }),
];
// Display drawmoninstance delete form on GET.
exports.drawmoninstance_delete_get = asyncHandler(async (req, res, next) => {
  const drawmonInstance = await DrawmonInstance.findById(req.params.id)
    .populate('drawmon')
    .exec();

  res.render('drawmoninstance_delete', {
    title: 'Drawmon instance Detail',
    drawmon_instance: drawmonInstance,
    delete_drawmoninstance: 'true',
  });
});

// Handle drawmoninstance delete on POST.
exports.drawmoninstance_delete_post = asyncHandler(async (req, res, next) => {
  const drawmonInstance = await DrawmonInstance.findById(req.params.id).exec();
  if (drawmonInstance === null) {
    // No results.
    const err = new Error('Drawmon instance not found');
    err.status = 404;
    return next(err);
  } else {
    await DrawmonInstance.findByIdAndDelete(drawmonInstance._id);
    res.redirect(`/catalog/drawmoninstances`);
  }
});

// Display drawmoninstance update form on GET.
exports.drawmoninstance_update_get = asyncHandler(async (req, res, next) => {
  const drawmonInstance = await DrawmonInstance.findById(req.params.id)
    .populate('drawmon')
    .exec();
  const allDrawmons = await Drawmon.find({}).sort({ name: 1 }).exec();

  if (drawmonInstance === null) {
    // No results.
    const err = new Error('Drawmon not found');
    err.status = 404;
    return next(err);
  }
  res.render('drawmoninstance_form', {
    title: 'Update Drawmon instance',
    drawmon_instance: drawmonInstance,
    drawmon_list: allDrawmons,
  });
});

// Handle drawmoninstance update on POST.
exports.drawmoninstance_update_post = [
  body('personal_name', 'Name must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('background_info').trim().isLength({ max: 100 }).escape(),
  body('likes').trim().isLength({ max: 100 }).escape(),
  body('dislikes').trim().isLength({ max: 100 }).escape(),
  body('hobbies').trim().isLength({ max: 100 }).escape(),
  body('other_info').trim().isLength({ max: 200 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const drawmonId = JSON.parse(req.body.selected_drawmon)[0];
    const drawmonInstance = new DrawmonInstance({
      personal_name: req.body.personal_name,
      background_info: req.body.background_info,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      hobbies: req.body.hobbies,
      other_info: req.body.other_info,
      drawmon: drawmonId,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      res.render('drawmoninstance_form', {
        title: 'Update Drawmon instance',
        drawmon_instance: drawmonInstance,
      });
      return;
    } else {
      // Data from form is valid
      const updatedDrawmonInstance = await DrawmonInstance.findByIdAndUpdate(
        req.params.id,
        drawmonInstance,
        {}
      ).exec();
      res.redirect(updatedDrawmonInstance.url);
    }
  }),
];
