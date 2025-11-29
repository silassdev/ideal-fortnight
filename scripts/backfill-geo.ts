// scripts/backfill-geo.ts
import 'dotenv/config';
import geoip from 'geoip-lite';
import { MongoClient } from 'mongodb';

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is required');

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const cursor = users.find({ $or: [{ createdIp: { $exists: true, $ne: null } }, { lastLoginIp: { $exists: true, $ne: null } }] });
    let count = 0;
    while (await cursor.hasNext()) {
        const u = await cursor.next();
        if (!u) continue;
        const ip = u.createdIp || u.lastLoginIp;
        if (!ip) continue;
        const normalized = ip.includes(':') && ip.split(':').length > 1 && ip.includes('.') ? ip.split(':')[0] : ip;
        const geo = geoip.lookup(normalized);
        if (!geo) continue;
        await users.updateOne({ _id: u._id }, {
            $set: {
                country: geo.country || null,
                region: geo.region || null,
                city: geo.city || null,
                ipInfo: geo,
            },
        });
        count += 1;
        console.log('Updated', u.email, normalized, geo.country);
    }

    console.log('Backfilled', count, 'users');
    await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
