import { model, models, Schema } from "mongoose";

const DepartmentSchema = new Schema(
  {
    DepartmentName: {
      type: String,
      required: true,
      unique: true,
    },
    DepartmentShortName: {
      type: String,
      required: true,
      unique: true,
    },
    DepartmentDetails: {
      type: String,
    },
    DepartmentStatus: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Department = models.Department || model("Department", DepartmentSchema);
export default Department;
