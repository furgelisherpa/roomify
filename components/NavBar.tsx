import { Box } from "lucide-react";
import { Button } from "./ui";
import { Link, useOutletContext } from "react-router";

export default function NavBar() {
  const { isSignedIn, userName, signIn, signOut, openAuth } = useOutletContext<AuthContext>();

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (e) {
        console.error(`Putter sign out failed: ${e}`);
      }
    } else {
      try {
        openAuth();
      } catch (e) {
        console.error(`Opening auth modal failed: ${e}`);
      }
    }
  };

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <Link to="/" className="brand">
            <Box className="logo" />
            <span className="name">Roomify</span>
          </Link>
        </div>

        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">{userName ? `Hi, ${userName}` : "Signed In"}</span>
              <Button size="sm" onClick={handleAuthClick} className="btn">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAuthClick} size="sm" variant="ghost">
                Login
              </Button>
              <a
                href="/#upload"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="cta"
              >
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
