import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      trim: true
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
    tags: {
      type: [String],
      default: []
    },
    favorite: {
      type: Boolean,
      default: false
    },
    pinned: {
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

noteSchema.index({ subjectId: 1, pinned: -1, favorite: -1 });
noteSchema.index({ createdAt: -1 });

export const Note = mongoose.model('Note', noteSchema);
export default Note;
