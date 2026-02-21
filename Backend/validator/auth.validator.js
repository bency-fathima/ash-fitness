import { z } from "zod";

export const userLoginSchema = z
  .object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email("Invalid email format"),

    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      // .min(8, "Password must be at least 8 characters"),
  })
  .strict();

export const adminUserCreateValidator = z.object({
  name: z.string({
    required_error: "Name is Required",
    invalid_type_error: "Name must be string",
  }),

  dob: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "DOB must be DD-MM-YYYY"),

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

  currentWeight: z.number({
    required_error: "Weight is Required",
    invalid_type_error: "Weight must be Number",
  }),

  targetWeight: z.number({
    required_error: "Target Weight is Required",
    invalid_type_error: "Target Weight must be Number",
  }),

  medicalConditions: z.array(z.string(), {
    required_error: "Medical conditions is required",
    invalid_type_error: "Medical conditions must be an array",
  }),

  allergies: z.array(z.string(), {
    required_error: "Allergies is required",
    invalid_type_error: "Allergies must be an array",
  }),

  foodPreferances: z.string({
    required_error: "Food Preferances is Required",
    invalid_type_error: "Food Preferances Must be a string",
  }),

  duration: z.number({
    required_error: "Duration is required",
    invalid_type_error: "Duration must be number",
  }),

  programStartDate: z.coerce.date({
    required_error: "Program Start Date is Required",
    invalid_type_error: "Invalid date format",
  }),

  programEndDate: z.coerce
    .date({
      required_error: "Program End Date is Required",
      invalid_type_error: "Program End date is required",
    })
    .refine(
      (data) =>
        data.programEndDate.getTime() !== data.programStartDate.getTime()
    ),
}).strict()

// Password reset validators
export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
}).strict();

export const verifyOTPSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  otp: z
    .string({
      required_error: "OTP is required",
      invalid_type_error: "OTP must be a string",
    })
    .regex(/^\d{4}$/, "OTP must be exactly 4 digits")
    .length(4, "OTP must be exactly 4 digits"),
}).strict();

export const resetPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  otp: z
    .string({
      required_error: "OTP is required",
      invalid_type_error: "OTP must be a string",
    })
    .regex(/^\d{4}$/, "OTP must be exactly 4 digits")
    .length(4, "OTP must be exactly 4 digits"),
  newPassword: z
    .string({
      required_error: "New password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
}).strict();
