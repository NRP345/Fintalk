
import bcrypt from 'bcrypt';
console.log('bcrypt version:', bcrypt.getRounds ? 'OK' : 'Error');
process.exit(0);
