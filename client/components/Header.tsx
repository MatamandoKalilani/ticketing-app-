import Link from "next/link";

interface CurrentUser {
  id: string;
  email: string;
}

interface HeaderProps {
  currentUser: null | CurrentUser;
}

const Header = ({ currentUser }: HeaderProps) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">TopTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {currentUser ? (
            <li className="nav-item">
              <Link href="/auth/signout">
                <a className="navbar-link">Sign Out</a>
              </Link>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link href="/auth/signin">
                  <a className="nav-link">Sign In</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/auth/signup">
                  <a className="nav-link">Sign Up</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
