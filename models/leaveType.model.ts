import { model, models, Schema } from "mongoose";

const LeaveTypeSchema = new Schema(
  {
    LeaveTypeName: {
      type: String,
      required: true,
      unique: true,
    },
    LeaveTypeDetails: {
      type: String,
    },
    LeaveTypeStatus: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const LeaveType = models.LeaveType || model("LeaveType", LeaveTypeSchema);
export default LeaveType;
