//External Lib Import
import { model, models, Schema } from "mongoose";

const EmployeesSchema = new Schema(
  {
    DepartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
      required: true,
    },
    Phone: {
      type: String,
      required: true,
      unique: true,
    },
    Email: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (prop: { value: string }) =>
          `Invalid Email Address: ${prop.value}`,
      },
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Roles: {
      type: String,
      enum: [
        "COMMISSIONER_GENERAL",
        "COMMISSIONER",
        "ASSISTANT_COMMISSIONER",
        "MANAGER",
        "SUPERVISOR",
        "OFFICER",
        "ADMIN",
      ],
      required: true,
      default: "OFFICER",
    },
    DirectSupervisor: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    Image: {
      type: String,
      required: true,
    },
    password_reset_token: {
      required: false,
      type: Schema.Types.String,
      trim: true,
    },
    magic_link_token: {
      required: false,
      type: Schema.Types.String,
      trim: true,
    },
    magic_link_sent_at: {
      required: false,
      type: Schema.Types.Date,
    },
  },

  { versionKey: false, timestamps: true }
);

const Employee = models.Employee || model("Employee", EmployeesSchema);
export default Employee;
