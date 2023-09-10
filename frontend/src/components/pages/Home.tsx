import { Add } from "../links/Add"
import { Get } from "../links/Get"
import { Toast } from "../utils/Toast"
import { Query } from "../utils/query/Query"

export const Home = () => {
  return (
    <Query>
      <main className="flex flex-col justify-start items-center mt-16 min-h-screen text-white">
        <Add />
        <Get />
        <Toast />
      </main>
    </Query>
  )
}
