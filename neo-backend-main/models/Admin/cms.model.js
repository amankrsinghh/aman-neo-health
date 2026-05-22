import mongoose from "mongoose";

const cmsSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
  },
  panel:{type:String,enum:['website','pharmacy','patient','doctor','hospital','lab'],default:'website'},
  title: String,
  content: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model("CMS", cmsSchema);
