import * as therapyService from './therapy.service.js';

export const createTherapyController = async (req, res) => {
  try {
    const therapy = await therapyService.createTherapy(req.body);
    res.status(201).json({
      success: true,
      message: "Therapy created successfully",
      data: therapy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllTherapyController = async (req, res) => {
  try {
    const {page, limit} = req.params
    const therapy = await therapyService.getAllTherapy(page, limit);
    if (!therapy) {
      return res.status(404).json({ message: "Therapy not found" });
    }
    res.status(200).json({ success: true, data: therapy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTherapyController = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTherapy = await therapyService.updateTherapy(id, req.body);
    if (!updatedTherapy) {
      return res.status(404).json({ success: false, message: "Therapy not found" });
    }
    res.status(200).json({ success: true, message: "Therapy updated successfully", data: updatedTherapy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTherapyController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTherapy = await therapyService.deleteTherapy(id);
    if (!deletedTherapy) {
      return res.status(404).json({ success: false, message: "Therapy not found" });
    }
    res.status(200).json({ success: true, message: "Therapy deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getATherapyController = async (req, res) => {
  const {id}=req.params
  if (!id) {
      return res.status(400).json({
        success: false,
        message: "Therapy Plan ID is required",
      });
    }

  try {
    const therapy = await therapyService.getTherapyById(id);
         

    if (!therapy) {
      return res.status(404).json({ message: "Therapy not found" });
    }
    res.status(200).json({ success: true, data: therapy });
  } catch (error) {    
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: fileUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 
