import { connect } from "@planetscale/database"

export const pscale = connect({
  host: import.meta.env.DB_HOST,
  username: import.meta.env.DB_USERNAME,
  password: import.meta.env.DB_PASSWORD
})
