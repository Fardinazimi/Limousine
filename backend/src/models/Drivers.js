import mongoose from 'mongoose';

const DriversSchema = new mongoose.Schema(
  {
    drivers: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: 'drivers_collection',
  }
);

export default mongoose.model('Drivers', DriversSchema);
