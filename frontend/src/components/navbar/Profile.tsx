import type { User } from "../../types/session";
import { getBackendPath } from "../../utils/path";

export const Profile = ({ user }: { user: User | null; }) => {
  return (
    <>
      {user ? (
      <>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src={user.photo_url} />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="p-2 mt-3 w-52 border shadow menu menu-sm dropdown-content z-[1] bg-base-100 rounded-box border-slate-800"
          >
            <li>
              <a href={getBackendPath("/auth/logout", [`state=${encodeURI(window.location.href)}`])}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </>
      ) : (
        <>
          <a className="btn btn-ghost" href={getBackendPath("/auth/login", [`state=${encodeURI(window.location.href)}`])}>
            Login
          </a>
        </>
      )}
    </>
  )
}
