// models/SuperAdmin.model.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SuperAdminSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phone: { type: String, trim: true },
        avatar: { type: String, default: "" },
        password: { type: String, required: true, select: false },
        lastLoginAt: { type: Date },
        lastPasswordChangeAt: { type: Date },
    },
    { timestamps: true }
);

SuperAdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.lastPasswordChangeAt = new Date();
    next();
});

SuperAdminSchema.methods.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
};

SuperAdminSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

/**
 * Seed the single Super Admin from env if not exists
 */
SuperAdminSchema.statics.seedSuperAdminIfNeeded = async function () {
    const SuperAdmin = this;
    const exists = await SuperAdmin.findOne();
    if (exists) return false;
    const { SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, SUPER_ADMIN_PHONE } =
        process.env;
    if (!SUPER_ADMIN_NAME || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
        throw new Error("Missing SUPER_ADMIN_* env vars");
    }
    await SuperAdmin.create({
        fullName: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        phone: SUPER_ADMIN_PHONE || "",
        password: SUPER_ADMIN_PASSWORD,
    });
    return true;
};

export const SuperAdminModel = mongoose.model("SuperAdminModel", SuperAdminSchema);
