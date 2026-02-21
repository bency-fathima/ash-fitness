import express from 'express'
 import {
   createCategoryController,
   deleteAllCategoriesController,
   deleteSingleCategoryController,
   getAllCategoryController,
   getSingleCategoryController,
   updateCategoryController,
   gatFounderCategoryList,
 } from "./category.controller.js";
 import { authMiddleware } from "../../middleware/authMiddleware.js";
 const router=express.Router()

router.post('/create', authMiddleware, createCategoryController)
router.get('/list/:page/:limit',getAllCategoryController)
router.get('/list/:id',getSingleCategoryController)
router.get("/founder/list/:page/:limit", authMiddleware, gatFounderCategoryList);
router.put('/update/:id', authMiddleware, updateCategoryController)
router.delete('/delete/:id', authMiddleware, deleteSingleCategoryController)
router.delete('/delete', authMiddleware, deleteAllCategoriesController)




export default router