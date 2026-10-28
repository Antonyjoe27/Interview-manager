import mongoose from 'mongoose';

const VALID_SUBJECTS = ['dsa', 'dbms', 'os', 'cn', 'oop', 'system-design', 'general'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];
const VALID_PRIORITIES = ['high', 'medium', 'low'];
const VALID_STATUSES = ['pending', 'completed'];

const preparationTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    subjectId: {
      type: String,
      required: [true, 'Subject identifier is required'],
      enum: {
        values: VALID_SUBJECTS,
        message: 'Invalid subject identifier: {VALUE}'
      },
      trim: true
    },
    topic: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    difficulty: {
      type: String,
      enum: {
        values: VALID_DIFFICULTIES,
        message: 'Invalid difficulty level: {VALUE}'
      },
      default: 'medium'
    },
    priority: {
      type: String,
      enum: {
        values: VALID_PRIORITIES,
        message: 'Invalid priority level: {VALUE}'
      },
      default: 'medium'
    },
    dueDate: {
      type: String,
      trim: true,
      default: ''
    },
    estimatedMinutes: {
      type: Number,
      min: [1, 'Estimated minutes must be a positive number'],
      default: 30
    },
    completed: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: {
        values: VALID_STATUSES,
        message: 'Invalid task status: {VALUE}'
      },
      default: 'pending'
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

// Synchronize completed boolean and status string before saving
preparationTaskSchema.pre('validate', function (next) {
  if (this.completed === true) {
    this.status = 'completed';
  } else if (this.status === 'completed') {
    this.completed = true;
  } else {
    this.status = 'pending';
    this.completed = false;
  }
  next();
});

// Indexes for high-performance dashboard queries and filtering
preparationTaskSchema.index({ subjectId: 1, completed: 1 });
preparationTaskSchema.index({ dueDate: 1 });

export const PreparationTask = mongoose.model('PreparationTask', preparationTaskSchema);
export default PreparationTask;
