import Testimonial from "./testimonial.model.js";

export const createTestimonial=async (data)=>{
    return await Testimonial.create(data);
}


export const getAllTestimonial=async()=>{
   return  await Testimonial.find()
   
}


export const getSingleTestimonial=async(id)=>{
   return await Testimonial.findById(id)
   
}

export const updateTestimonial=async(id,data)=>{
    return await Testimonial.findByIdAndUpdate(id,data)
}

export const deleteSingleTestimonial=async(id)=>{
    return await Testimonial.findByIdAndDelete(id)
}

export const deleteAllTestimonial=async()=>{
    return await Testimonial.deleteMany()
}