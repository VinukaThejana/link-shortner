import { connect } from '@planetscale/database';

export const pscale = connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
})
