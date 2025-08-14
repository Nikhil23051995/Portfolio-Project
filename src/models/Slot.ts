
import mongoose, { Schema } from 'mongoose';

export interface ISlot extends mongoose.Document {
  id: string;
  date: Date;
  time: string;
  isBooked: boolean;
}

const slotSchema = new Schema({
  id: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
});

export default mongoose.model<ISlot>('Slot', slotSchema);





// import mongoose, { Schema } from 'mongoose';

// const slotSchema = new Schema({
//   id: { type: String, required: true, unique: true },
//   date: { type: Date, required: true },
//   time: { type: String, required: true }, // Changed to String
//   isBooked: { type: Boolean, default: false },
// });

// export default mongoose.model('Slot', slotSchema);