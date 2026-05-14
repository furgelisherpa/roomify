import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router";
import { generate3DView } from "../../lib/ai.action";
import { Box, Download, Share2, RefreshCcw, X } from "lucide-react";
import { Button } from "../../components/ui";
import { createProject, getProjectById } from "../../lib/puter.action";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

const VisualizerId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useOutletContext<AuthContext>();

  const hasInitialGeneratedRef = useRef(false);

  const [project, setProject] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => navigate("/");
  const handleExport = async () => {
    if (!currentImage) return;

    try {
      const response = await fetch(currentImage);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `roomify-${id || "render"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Export failed", e);
      // Fallback to direct href if blob fails
      const link = document.createElement("a");
      link.href = currentImage;
      link.download = `roomify-${id || "render"}.png`;
      link.click();
    }
  };

  const runGeneration = useCallback(
    async (item: DesignItem) => {
      if (!id || !item.sourceImage) return;

      try {
        setIsProcessing(true);
        const result = await generate3DView({ sourceImage: item.sourceImage });

        if (result.renderedImage) {
          setCurrentImage(result.renderedImage);

          const updatedItem = {
            ...item,
            renderedImage: result.renderedImage,
            renderedPath: result.renderedPath,
            timestamp: Date.now(),
            ownerId: item.ownerId ?? userId ?? null,
            isPublic: item.isPublic ?? false,
          };

          const saved = await createProject({ item: updatedItem, visibility: "private" });
          if (saved) {
            setProject(saved);
            setCurrentImage(saved.renderedImage || result.renderedImage);
          }
        }
      } catch (error) {
        console.error("Generation failed", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [id, userId],
  );

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!id) {
        setIsProjectLoading(false);
        return;
      }

      setIsProjectLoading(true);

      const fetchedProject = await getProjectById({ id });

      if (!isMounted) return;

      setProject(fetchedProject);
      setCurrentImage(fetchedProject?.renderedImage || null);
      setIsProjectLoading(false);
      hasInitialGeneratedRef.current = false;
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (isProjectLoading || hasInitialGeneratedRef.current || !project?.sourceImage) return;

    hasInitialGeneratedRef.current = true;

    if (!project.renderedImage) {
      void runGeneration(project);
    }
  }, [project, isProjectLoading, runGeneration]);

  return (
    <div className="visualizer">
      <nav className="topbar">
        <Link to="/" className="brand">
          <Box className="logo" />

          <span className="name">Roomify</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <X className="icon" />
          Exit Editor
        </Button>
      </nav>

      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>
              <h2>{project?.name || `Residence ${id}`}</h2>
              <p className="note">Created by You</p>
            </div>

            <div className="panel-actions">
              <Button
                size="sm"
                onClick={handleExport}
                className="expert"
                disabled={!currentImage || isProcessing}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
            {currentImage ? (
              <img src={currentImage} alt="AI Render" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {project?.sourceImage && (
                  <img src={project?.sourceImage} alt="Original" className="render-fallback" />
                )}
              </div>
            )}

            {isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <RefreshCcw className="spinner" />
                  <span className="title">Rendering...</span>
                  <span className="subtitle">Generating your 3D visualization</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="panel compare">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Comparison</p>
              <h3>Before and After</h3>
            </div>
            <div className="hint">Drag to compare</div>
          </div>

          <div className="compare-stage">
            {project?.sourceImage && currentImage ? (
              <ReactCompareSlider
                defaultValue={50}
                style={{ width: "100%", height: "100%" }}
                itemOne={
                  <ReactCompareSliderImage
                    src={project?.sourceImage}
                    alt="before"
                    className="compare-img"
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={currentImage || project?.renderedImage || undefined}
                    alt="after"
                    className="compare-img"
                  />
                }
              />
            ) : (
              <div className="compare-fallback">
                {project?.sourceImage && (
                  <img src={project.sourceImage} alt="Before" className="compare-img" />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisualizerId;
