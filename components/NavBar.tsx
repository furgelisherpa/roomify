import { Box } from "lucide-react";
import { Button } from "./ui";
import { useOutletContext } from "react-router";

export default function NavBar() {
  const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>();

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (e) {
        console.error(`Putter sign out failed: ${e}`);
      }
    } else {
      try {
        await signIn();
      } catch (e) {
        console.error(`Puter sign in failed: ${e}`);
      }
    }
  };

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className="name">Roomify</span>
          </div>
          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprise</a>
          </ul>
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
              <a href="#upload" className="cta">
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
