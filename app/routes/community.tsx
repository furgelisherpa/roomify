import { ArrowUpRight, Clock, Box, Users } from "lucide-react";
import NavBar from "../../components/NavBar";
import type { Route } from "./+types/community";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getCommunityProjects } from "../../lib/puter.action";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Community - Roomify" },
    { name: "description", content: "Explore amazing 3D renders from the Roomify community." },
  ];
}

export default function Community() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const items = await getCommunityProjects();
      setProjects(items);
      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  return (
    <div className="home community-page">
      <NavBar />

      <section className="community-hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>Community Showcase</p>
        </div>

        <h1>Design Inspiration from around the world</h1>
        <p className="subtitle">
          Explore how others are transforming their spaces with Roomify's AI-powered 3D
          visualization.
        </p>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <div className="mb-2 flex items-center gap-2">
                <Users className="text-orange-600" size={20} />
                <span className="text-xs font-bold tracking-widest text-orange-600 uppercase">
                  Community Gallery
                </span>
              </div>
              <h2>Shared Creations</h2>
              <p>Discover the latest architectural renders shared by our designers.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">
              <Box className="animate-spin text-zinc-300" size={40} />
              <p>Loading inspiration...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p>No community projects shared yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(({ id, name, renderedImage, sourceImage, timestamp, ownerId }) => (
                <div
                  key={id}
                  className="project-card group"
                  onClick={() => navigate(`/visualizer/${id}`)}
                >
                  <div className="preview">
                    <img src={renderedImage || sourceImage} alt="Project" />
                  </div>

                  <div className="card-body">
                    <div>
                      <h3>{name}</h3>
                      <div className="meta">
                        <Clock size={12} />
                        <span suppressHydrationWarning>
                          {new Date(timestamp).toLocaleDateString()}
                        </span>
                        <span>Shared by Designer</span>
                      </div>
                    </div>

                    <div className="arrow">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
