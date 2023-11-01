import { model, models, Schema } from "mongoose";

const LeaveSchema = new Schema(
  {
    Employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    LeaveType: {
      type: Schema.Types.ObjectId,
      ref: "LeaveType",
      required: true,
    },
    LeaveDetails: {
      type: String,
      required: true,
    },
    StartLeaveDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    EndLeaveDate: {
      type: Date,
      required: true,
    },
    NumOfDays: {
      type: Number,
      required: true,
    },
    AdminRemark: {
      type: String,
      default: "",
    },
    AdminStatus: {
      type: String,
      enum: ["Pending", "Rejected", "Approved"],
      default: "Pending",
    },
  },
  { timestamps: true, versionKey: false }
);

const Leave = models.Leave || model("Leave", LeaveSchema);
export default Leave;
