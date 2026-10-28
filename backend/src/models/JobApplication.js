import mongoose from 'mongoose';

const VALID_STATUSES = [
  'Wishlist',
  'Applied',
  'Assessment',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn'
];

const VALID_WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
const VALID_JOB_TYPES = ['Full-time', 'Internship', 'Contract', 'Other'];

// URL validation helper
const urlValidator = (val) => {
  if (!val || val.trim() === '') return true;
  try {
    const parsed = new URL(val);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

// Email validation helper
const emailValidator = (val) => {
  if (!val || val.trim() === '') return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
};

const jobApplicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Job role title is required'],
      trim: true
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    workMode: {
      type: String,
      enum: {
        values: VALID_WORK_MODES,
        message: 'Invalid work mode: {VALUE}'
      },
      default: 'Remote'
    },
    jobType: {
      type: String,
      enum: {
        values: VALID_JOB_TYPES,
        message: 'Invalid job type: {VALUE}'
      },
      default: 'Full-time'
    },
    jobUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: urlValidator,
        message: 'Invalid job URL format. Must start with http:// or https://'
      }
    },
    applicationDate: {
      type: String,
      required: [true, 'Application date is required (YYYY-MM-DD)'],
      trim: true
    },
    deadline: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      required: [true, 'Application status is required'],
      enum: {
        values: VALID_STATUSES,
        message: 'Invalid application status: {VALUE}'
      },
      default: 'Applied'
    },
    source: {
      type: String,
      trim: true,
      default: 'Company Website'
    },
    contactName: {
      type: String,
      trim: true,
      default: ''
    },
    contactEmail: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: emailValidator,
        message: 'Invalid contact email address'
      }
    },
    salaryRange: {
      type: String,
      trim: true,
      default: ''
    },
    followUpDate: {
      type: String,
      trim: true,
      default: ''
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

jobApplicationSchema.index({ status: 1, applicationDate: -1 });
jobApplicationSchema.index({ company: 1 });

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;
