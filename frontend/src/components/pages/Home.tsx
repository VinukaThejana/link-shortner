import { Add } from "../links/Add"
import { Get } from "../links/Get"
import { Query } from "../utils/query/Query"

export const Home = () => {
  return (
    <Query>
      <main className="flex flex-col justify-start items-center mt-16 min-h-screen text-white">
        <Add />
        <Get />
      </main>
    </Query>
  )
}
