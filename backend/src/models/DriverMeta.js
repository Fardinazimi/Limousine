import mongoose from 'mongoose';

const DriverMetaItemSchema = new mongoose.Schema(
  {
    defaultShift: { type: String, default: '' },
    carPlate: { type: String, default: '' },
    carModel: { type: String, default: '' },
  },
  { _id: false }
);

const DriverMetaSchema = new mongoose.Schema(
  {
    meta: {
      type: Map,
      of: DriverMetaItemSchema,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: 'driver_meta_collection',
  }
);

export default mongoose.model('DriverMeta', DriverMetaSchema);
