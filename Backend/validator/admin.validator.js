import z from "zod";

export const adminValidationSchema = z.object({
  fullname: z.string({
    required_error: "Fullname is required",
    invalid_type_error: "Fullname must be a string",
  }),
  dob: z.string({
    required_error: "Date of Birth is required",
    invalid_type_error: "Date of Birth must be a string",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
    invalid_type_error: "Gender must be a string",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  address: z.string({
    required_error: "Address is Required",
    invalid_type_error: "Address must be string",
  }),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, "Password must be at least 8 characters"),
  specialization: z.array(z.string(), {
    required_error: "Specialisation is Required",
    invalid_type_error: "Specialisation must be string",
  }),
  chooseProgram:z.array(z.string(), {
    required_error: "Program is Required",
    invalid_type_error: "Program must be string",
  }),
  baseSalary: z.number({
    required_error: "Base Salary is Required",
    invalid_type_error: "Base Salary must be number",
  }),
  experience: z.string({
    required_error: "Experience is Required",
    invalid_type_error: "Experience must be string",
  }),
  qualification: z.string({
    required_error: "Qualification is Required",
    invalid_type_error: "Qualification must be string",
  }),
  headId: z.string().optional(),
  autoSendWelcome: z.boolean().optional(),
  autoSendGuide: z.boolean().optional(),
  automatedReminder: z.boolean().optional(),
})
