import * as headService from "./heads.service.js";

export const createHead = async (req, res) => {
  try {
    const { head, totalCount } = await headService.createHead(req.body);
    res.status(201).json({
      success: true,
      data: head,
      total: totalCount,
    });
  } catch (error) {

    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllHeads = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const heads = await headService.getAllHeads(page, limit);
    res.status(201).json({
      success: true,
      data: heads,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getHeadById = async (req, res) => {
  try {
    const head = await headService.getHeadById(req.params.id);
    res.status(200).json({
      success: true,
      data: head,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateHead = async (req, res) => {
  try {
    const head = await headService.updateHead(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: head,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteHead = async (req, res) => {
  try {
    const result = await headService.deleteHead(req.params.id);

    // Head is in use
    if (!result.canDelete) {
      return res.status(409).json({
        success: false,
        message: result.message,
      });
    }

    // Deleted
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.head,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const { duration } = req.query;
    const head = await headService.getDashboardData(req.params.id, duration);
    res.status(200).json({
      success: true,
      data: head,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCoachesByHead = async (req, res) => {
  try {
    const { headId, page, limit } = req.params;
    const { coaches, totalCount } = await headService.getAllCoachesByHead(headId, page, limit);
    res.status(200).json({
      success: true,
      data: coaches,
      total: totalCount,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const getAllUsersByHead = async (req, res) => {
  try {
    const { headId, page, limit } = req.params;
    const { users, totalCount } = await headService.getAllUsersByHead(headId, page, limit);
    res.status(200).json({
      success: true,
      data: users,
      total: totalCount,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

export const founderHeadList = async (req, res) => {
  try {
    const { page, limit } = req.params;
    const list = await headService.founderHeadList(page, limit)
    res.status(200).json({
      success: "true1",
      data: list,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}