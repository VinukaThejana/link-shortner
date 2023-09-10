import { Add } from "@/components/links/Add";
import { Get } from "@/components/links/Get";
import { Query } from "@/components/utils/Query";

export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center mt-16 min-h-screen text-white">
      <Query>
        <>
          <Add />
          <Get />
        </>
      </Query>
    </div>
  )
}
