import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


before(async () => {
  await mongoose.connect(process.env.TEST_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});


beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});


after(async () => {
  await mongoose.disconnect();
});
