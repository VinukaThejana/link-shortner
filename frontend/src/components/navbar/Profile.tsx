import type { User } from "../../types/session";

export const Profile = ({ user }: { user: User | null }) => {
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
            <li><a>Logout</a></li>
          </ul>
        </div>
      </>
      ) : (
        <>
          <button className="btn btn-ghost">
            Login
          </button>
        </>
      )}
    </>
  )
}
