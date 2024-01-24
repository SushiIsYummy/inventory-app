const express = require('express');
const router = express.Router();

// Require controller modules.
const drawmon_controller = require('../controllers/drawmonController');
const drawmoninstance_controller = require('../controllers/drawmonInstanceController');
const type_controller = require('../controllers/typeController');

// GET catalog home page.

router.get('/', drawmon_controller.index);

/// drawmon ROUTES ///

// GET request for creating drawmon. NOTE This must come before route for id (i.e. display drawmon).
router.get('/drawmon/create', drawmon_controller.drawmon_create_get);

// POST request for creating drawmon.
router.post('/drawmon/create', drawmon_controller.drawmon_create_post);

// GET request to delete drawmon.
router.get('/drawmon/:id/delete', drawmon_controller.drawmon_delete_get);

// POST request to delete drawmon.
router.post('/drawmon/:id/delete', drawmon_controller.drawmon_delete_post);

// GET request to update drawmon.
router.get('/drawmon/:id/update', drawmon_controller.drawmon_update_get);

// POST request to update drawmon.
router.post('/drawmon/:id/update', drawmon_controller.drawmon_update_post);

// GET request for one drawmon.
router.get('/drawmon/:id', drawmon_controller.drawmon_detail);

// GET request for list of all drawmons.
router.get('/drawmons', drawmon_controller.drawmon_list);

/// drawmon instance ROUTES ///

// GET request for creating drawmon. NOTE This must come before route for id (i.e. display drawmon).
router.get(
  '/drawmoninstance/create',
  drawmoninstance_controller.drawmoninstance_create_get
);

// POST request for creating drawmon.
router.post(
  '/drawmoninstance/create',
  drawmoninstance_controller.drawmoninstance_create_post
);

// GET request to delete drawmon.
router.get(
  '/drawmoninstance/:id/delete',
  drawmoninstance_controller.drawmoninstance_delete_get
);

// POST request to delete drawmon.
router.post(
  '/drawmoninstance/:id/delete',
  drawmoninstance_controller.drawmoninstance_delete_post
);

// GET request to update drawmon.
router.get(
  '/drawmoninstance/:id/update',
  drawmoninstance_controller.drawmoninstance_update_get
);

// POST request to update drawmon.
router.post(
  '/drawmoninstance/:id/update',
  drawmoninstance_controller.drawmoninstance_update_post
);

// GET request for one drawmon.
router.get(
  '/drawmoninstance/:id',
  drawmoninstance_controller.drawmoninstance_detail
);

// GET request for list of all drawmons.
router.get(
  '/drawmoninstances',
  drawmoninstance_controller.drawmoninstance_list
);

/// type ROUTES ///

// GET request for creating a type. NOTE This must come before route that displays type (uses id).
router.get('/type/create', type_controller.type_create_get);

//POST request for creating type.
router.post('/type/create', type_controller.type_create_post);

// GET request to delete type.
router.get('/type/:id/delete', type_controller.type_delete_get);

// POST request to delete type.
router.post('/type/:id/delete', type_controller.type_delete_post);

// GET request to update type.
router.get('/type/:id/update', type_controller.type_update_get);

// POST request to update type.
router.post('/type/:id/update', type_controller.type_update_post);

// GET request for one type.
router.get('/type/:id', type_controller.type_detail);

// GET request for list of all type.
router.get('/types', type_controller.type_list);

module.exports = router;
