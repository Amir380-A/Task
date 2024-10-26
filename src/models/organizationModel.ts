import mongoose, { Schema, Document } from 'mongoose';

interface Member {
    name: string;
    email: string;
    access_level: string;
}

interface Organization extends Document {
    name: string;
    description: string;
    members: Member[];
}

const memberSchema = new Schema<Member>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    access_level: { type: String, required: true },
});

const organizationSchema = new Schema<Organization>({
    name: { type: String, required: true },
    description: { type: String },
    members: [memberSchema],
});

const OrganizationModel = mongoose.model<Organization>('Organization', organizationSchema);
export default OrganizationModel;
