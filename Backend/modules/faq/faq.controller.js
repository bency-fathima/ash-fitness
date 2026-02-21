import {
  createFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
} from "./faq.service.js";

export const createFaqController = async (req, res) => {
  try {
    const faq = await createFaq(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, data: req.body});
  }
};

export const getFaqsController = async (req, res) => {
  try {
    const faqs = await getAllFaqs();
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getFaqByIdController = async (req, res) => {
  try {
    const faq = await getFaqById(req.params.id);
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(404).json({ success: false, error: "FAQ not found" });
  }
};

export const updateFaqController = async (req, res) => {
  try {
    const faq = await updateFaq(req.params.id, req.body);
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteFaqController = async (req, res) => {
  try {
    await deleteFaq(req.params.id);
    res.json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    res.status(404).json({ success: false, error: "FAQ not found" });
  }
};
