import mongoose, { Document, Model } from 'mongoose';

const { Schema } = mongoose;

/**
 * Experience subdocument
 */
export type ExperienceSubdoc = {
    id: string; // client-side id (timestamp or uuid)
    company?: string;
    role?: string;
    start?: string; // e.g. "Jan 2020"
    end?: string; // e.g. "Present" or "Dec 2021"
    location?: string;
    bullets?: string[]; // list of achievements / responsibilities
    currentlyWorking?: boolean;
};

/**
 * Education subdocument
 */
export type EducationSubdoc = {
    id: string;
    school?: string;
    degree?: string;
    start?: string;
    end?: string;
    location?: string;
    notes?: string;
};

/**
 * Arbitrary extra sections (projects, certifications, awards, etc.)
 */
export type ExtraSection = {
    id: string;
    type?: string; // 'projects' | 'certifications' | custom
    title?: string;
    items?: any[]; // flexible shape (array of objects or strings)
    content?: string; // free HTML/markdown (sanitize before rendering!)
};

/**
 * Contact object
 */
export type ContactInfo = {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
};

/**
 * Resume document interface
 */
export interface IResume extends Document {
    userId: mongoose.Types.ObjectId | string;
    template?: string;
    publicId?: string;
    isPublic?: boolean;
    title?: string;
    name?: string;
    summary?: string;
    contact?: ContactInfo;
    experience?: ExperienceSubdoc[];
    education?: EducationSubdoc[];
    skills?: string[];
    sections?: ExtraSection[];
    pages?: any[]; // reserved for page-level content/metadata
    meta?: Record<string, any>;
    downloadCount?: number;
    // timestamps:
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Helper to generate a reasonably-unique short public id.
 * Combines a time-based component + random chars.
 */
function generatePublicId(length = 6) {
    const timePart = Date.now().toString(36).slice(-4);
    const randPart = Math.random().toString(36).slice(2, 2 + length);
    return `${timePart}${randPart}`;
}

/**
 * Schema definition
 */
const ExperienceSchema = new Schema<ExperienceSubdoc>(
    {
        id: { type: String, required: true },
        company: { type: String, default: '' },
        role: { type: String, default: '' },
        start: { type: String, default: '' },
        end: { type: String, default: '' },
        startMonth: { type: String, default: '' },
        startYear: { type: String, default: '' },
        endMonth: { type: String, default: '' },
        endYear: { type: String, default: '' },
        location: { type: String, default: '' },
        bullets: { type: [String], default: [] },
        currentlyWorking: { type: Boolean, default: false },
    },
    { _id: false }
);

const EducationSchema = new Schema<EducationSubdoc>(
    {
        id: { type: String, required: true },
        school: { type: String, default: '' },
        degree: { type: String, default: '' },
        start: { type: String, default: '' },
        end: { type: String, default: '' },
        startMonth: { type: String, default: '' },
        startYear: { type: String, default: '' },
        endMonth: { type: String, default: '' },
        endYear: { type: String, default: '' },
        location: { type: String, default: '' },
        notes: { type: String, default: '' },
    },
    { _id: false }
);

const ExtraSectionSchema = new Schema<ExtraSection>(
    {
        id: { type: String, required: true },
        type: { type: String },
        title: { type: String },
        items: { type: [Schema.Types.Mixed], default: [] },
        content: { type: String },
    },
    { _id: false }
);

const ContactSchema = new Schema<ContactInfo>(
    {
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        website: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
    },
    { _id: false }
);

const ResumeSchema = new Schema<IResume>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },

        // presentation
        template: { type: String, default: 'apela' }, // default template key
        isPublic: { type: Boolean, default: false },
        publicId: { type: String, unique: true, sparse: true },

        // main content
        title: { type: String, default: '' },
        name: { type: String, default: '' },
        summary: { type: String, default: '' },
        contact: { type: ContactSchema, default: {} },

        // sections
        experience: { type: [ExperienceSchema], default: [] },
        education: { type: [EducationSchema], default: [] },
        skills: { type: [Schema.Types.Mixed], default: [] },
        sections: { type: [ExtraSectionSchema], default: [] }, // custom sections like projects, awards

        // pages or additional layout info
        pages: { type: [Schema.Types.Mixed], default: [] },

        // metadata & analytics
        meta: { type: Schema.Types.Mixed, default: {} },
        downloadCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

/**
 * Pre-save: ensure a publicId exists when resume is marked public
 */
ResumeSchema.pre<IResume>('save', async function (next) {
    try {
        if (this.isPublic && !this.publicId) {
            // generate until unique (best-effort, limited attempts)
            let tries = 0;
            let candidate = '';
            const Model = mongoose.model<IResume>('Resume');
            do {
                candidate = generatePublicId(6);
                // check existence
                // eslint-disable-next-line no-await-in-loop
                const exists = await Model.findOne({ publicId: candidate }).lean();
                if (!exists) break;
                tries += 1;
            } while (tries < 5);

            if (!this.publicId) this.publicId = candidate;
        }
        next();
    } catch (err) {
        // don't block save on errors here — let the save continue
        // eslint-disable-next-line no-console
        console.error('Resume pre-save error:', err);
        next();
    }
});

/**
 * Instance method example: increment downloadCount
 */
ResumeSchema.methods.incrementDownloads = async function incrementDownloads(this: IResume) {
    // increment in DB and in-memory
    this.downloadCount = (this.downloadCount || 0) + 1;
    await this.save();
    return this.downloadCount;
};

/**
 * Static methods interface
 */
interface IResumeModel extends Model<IResume> {
    upsertByUser(userId: string | mongoose.Types.ObjectId, payload: Partial<IResume>): Promise<IResume>;
}

/**
 * Static helper: upsert resume by userId (one resume per user)
 * Usage: Resume.upsertByUser(userId, payload)
 */
ResumeSchema.statics.upsertByUser = async function upsertByUser(userId: string | mongoose.Types.ObjectId, payload: Partial<IResume>) {
    const filter = { userId: userId instanceof mongoose.Types.ObjectId ? userId : new mongoose.Types.ObjectId(userId) };
    const update = { $set: payload };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
    // findOneAndUpdate returns the document after update
    return this.findOneAndUpdate(filter, update, opts).lean();
};

// Avoid model compile errors on hot-reload in dev
const Resume: IResumeModel = (mongoose.models.Resume as IResumeModel) || mongoose.model<IResume, IResumeModel>('Resume', ResumeSchema);

export default Resume;
