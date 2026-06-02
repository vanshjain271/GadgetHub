/**
 * Banner Routes - MVP (Public)
 */

const express = require('express');
const router = express.Router();
const BannerController = require('../controllers/banner.controller');

// Banners change occasionally — cache for 2 minutes
const setCache = (req, res, next) => {
  res.set('Cache-Control', 'private, max-age=120');
  next();
};

router.get('/', setCache, BannerController.getActiveBanners);
router.post('/:bannerId/view', BannerController.trackView);
router.post('/:bannerId/click', BannerController.trackClick);

module.exports = router;