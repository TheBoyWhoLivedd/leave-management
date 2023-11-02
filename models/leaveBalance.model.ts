import { model, models, Schema } from "mongoose";
const LeaveBalanceSchema = new Schema(
  {
    Employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true, 
    },
    Balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

const LeaveBalance =
  models.LeaveBalance || model("LeaveBalance", LeaveBalanceSchema);
export default LeaveBalance;
