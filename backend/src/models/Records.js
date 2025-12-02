import mongoose from 'mongoose';

const RecordItemSchema = new mongoose.Schema(
  {
    id: { type: String },
    driver: { type: String },
    month: { type: String },
    weekNumber: { type: Number },
    startDate: { type: String },
    endDate: { type: String },
    uber: { type: Number },
    bonus: { type: Number },
    tips: { type: Number },
    cashCollectedAmount: { type: Number },
    cashHandedOver: { type: Number },
    transferToDriver: { type: Number },
  },
  { _id: false }
);

const RecordsSchema = new mongoose.Schema(
  {
    records: { type: [RecordItemSchema], default: [] },
  },
  {
    timestamps: true,
    collection: 'records_collection',
  }
);

export default mongoose.model('Records', RecordsSchema);
