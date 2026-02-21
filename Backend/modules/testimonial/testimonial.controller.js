import {
  createTestimonial,
  deleteAllTestimonial,
  deleteSingleTestimonial,
  getAllTestimonial,
  getSingleTestimonial,
  updateTestimonial,
} from "./testimonial.service.js";

export const testimonialController = async (req, res) => {
  try {
    if (req.file) {
      req.body.photo = "/uploads/" + req.file.filename;
    }

    const testimonial = await createTestimonial(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllTestimonialsController = async (req, res) => {
  try {
    const testimonials = await getAllTestimonial();
    res.status(200).json({ success: true, data: testimonials });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getSingleTestimonialController = async (req, res) => {
  try {
    const testimonial = await getSingleTestimonial(req.params.id);
    res.status(200).json({ success: true, data: testimonial });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateTestimonialController = async (req, res) => {
  try {
    const testimonial = await updateTestimonial(req.params.id, req.body);
    res.status(200).json({ success: true, data: testimonial });
  } catch {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteTestimonialController = async (req, res) => {
  try {
    const testimonial = await deleteSingleTestimonial(req.params.id);
    res.status(200).json({ success: true, data: testimonial });
  } catch {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteAllTestimonialController=async(req,res)=>{
  try{
    const testimonial=await deleteAllTestimonial()
    res.status(200).json({ success: true, data: testimonial });
  } catch {
    res.status(400).json({ success: false, message: err.message });
  }

  
}
