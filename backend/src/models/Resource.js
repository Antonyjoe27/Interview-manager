import mongoose from 'mongoose';

const VALID_RESOURCE_TYPES = [
  'Documentation',
  'Article',
  'Coding Practice',
  'Video',
  'Course',
  'Cheat Sheet',
  'Other'
];

const urlValidator = (val) => {
  if (!val || val.trim() === '') return false;
  try {
    const parsed = new URL(val);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true
    },
    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true,
      validate: {
        validator: urlValidator,
        message: 'Resource URL must be a valid HTTP or HTTPS address'
      }
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    subjectId: {
      type: String,
      trim: true,
      default: ''
    },
    topic: {
      type: String,
      trim: true,
      default: ''
    },
    resourceType: {
      type: String,
      enum: {
        values: VALID_RESOURCE_TYPES,
        message: 'Invalid resource type: {VALUE}'
      },
      default: 'Documentation'
    },
    tags: {
      type: [String],
      default: []
    },
    favorite: {
      type: Boolean,
      default: false
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

resourceSchema.index({ subjectId: 1, resourceType: 1 });
resourceSchema.index({ createdAt: -1 });

export const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
