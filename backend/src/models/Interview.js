import mongoose from 'mongoose';

const VALID_FORMATS = ['Online', 'Phone', 'In-person'];
const VALID_STATUSES = [
  'Scheduled',
  'Confirmed',
  'Pending Preparation',
  'Completed',
  'Cancelled',
  'Rescheduled'
];

const interviewSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Interview role title is required'],
      trim: true
    },
    stage: {
      type: String,
      trim: true,
      default: 'Technical Round 1'
    },
    date: {
      type: String,
      required: [true, 'Interview date is required (YYYY-MM-DD)'],
      trim: true
    },
    time: {
      type: String,
      trim: true,
      default: '14:00'
    },
    durationMinutes: {
      type: Number,
      min: [1, 'Interview duration must be at least 1 minute'],
      default: 60
    },
    format: {
      type: String,
      enum: {
        values: VALID_FORMATS,
        message: 'Invalid interview format: {VALUE}'
      },
      default: 'Online'
    },
    locationOrLink: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: 'Invalid interview status: {VALUE}'
      },
      default: 'Scheduled'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

interviewSchema.index({ date: 1, status: 1 });
interviewSchema.index({ company: 1 });

export const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
