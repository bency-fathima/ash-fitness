import {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteSingleCategory,
  deleteAllCategory,
  founderCategoryList,
} from "./category.service.js";
 
export const createCategoryController = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 
export const getAllCategoryController = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const { category, totalCount } = await getAllCategory(page, limit);
    return res.status(200).json({
      success: true,
      data: category,
      total: totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

 
export const getSingleCategoryController = async (req, res) => {
  try {
    const category = await getSingleCategory(req.params.id);
    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

 
export const updateCategoryController = async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 
export const deleteSingleCategoryController = async (req, res) => {
  try {
    const result = await deleteSingleCategory(req.params.id);

    if (!result.canDelete) {
      return res.status(409).json({
        success: false,
        message: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



 
export const deleteAllCategoriesController = async (req, res) => {
  try {
    const result = await deleteAllCategory();
    return res.status(200).json({
      success: true,
      message: "All categories deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const gatFounderCategoryList= async (req,res)=> {
  try {
    const page = Number(req.params.page);
    const limit = Number(req.params.limit);
    const list = await founderCategoryList(page, limit);
    return res.status(200).json({
      success: true,
      data: list,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
