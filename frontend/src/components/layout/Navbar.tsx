import { User } from "@/types/session";
import { getUser } from "@/utils/token";
import { cookies } from "next/headers"

export const Navbar = async () => {
  var user: User | null = null;

  const store = cookies();
  const cookie = store.get("session");
  if (cookie) {
    const session = cookie.value;
    if (session) {
      user = await getUser(session);
    }
  }

  return (
    <nav className="border-b navbar bg-base-100 border-b-slate-300">
      <div className="flex-1">
        <a className="text-xl text-white normal-case btn btn-ghost btn-active">
          Link Shortner
        </a>
      </div>
      <div className="flex-none">
        <>
          {user ? (
            <>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={user.photo_url} />
                  </div>
                </label>
              </div>
            </>
          ) : null}
        </>
      </div>
    </nav>
  )
}
