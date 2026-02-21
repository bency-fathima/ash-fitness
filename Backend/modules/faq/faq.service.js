import faqModel from "./faq.model.js"

export const createFaq=async(data)=>{
    return await faqModel.create(data)
}

export const getAllFaqs=async()=>{
    return await faqModel.find()
}

export const getFaqById=async(id)=>{
    return await faqModel.findById(id)
}

export const updateFaq=async(id,data)=>{
    return await faqModel.findByIdAndUpdate(id,data)
}
export const deleteFaq=async(id)=>{
    return await faqModel.findByIdAndDelete(id)
}