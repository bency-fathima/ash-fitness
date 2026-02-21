import * as broadcastService from "./broadcast.service.js"

export const createBroadcast = async (req, res) => {
    try {
        if (req.files && req.files.attachment && req.files.attachment[0]) {
          req.body.attachment = "/uploads/" + req.files.attachment[0].filename;
        }
        const broadcast = await broadcastService.createBroadcast(req.body)
        res.status(201).json({
            success:true,
            data: broadcast,
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getAllBroadcast = async (req, res) => {
    try {
        const {page, limit, type} = req.params;
        const broadcasts = await broadcastService.getAllBroadcast(
          page,
          limit,
          type,
        );
        res.status(200).json({
          success: true,
          data: broadcasts,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getBroadcast = async (req, res) => {
    try {
        const broadcast = await broadcastService.getBroadcast(req.params.id)
        res.status(200).json({
            success: true,
            data: broadcast,
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const deleteBroadcast = async (req, res) => {
    try {
        const broadcast = await broadcastService.deleteBroadcast(req.params.id)
        res.status(200).json({
          success: true,
          data: broadcast,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const updateBroadcast = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.files && req.files.attachment && req.files.attachment[0]) {
      req.body.attachment =
        "/uploads/" + req.files.attachment[0].filename;
    }

    const broadcast = await broadcastService.updateBroadcast(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: broadcast,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
