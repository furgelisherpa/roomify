import { useLocation } from "react-router";

const VisualizerId = () => {
  const { state } = useLocation();
  const base64Image = state?.image as string;
  return (
    <div>
      <img src={base64Image} alt="Upload floor plan" />
    </div>
  );
};

export default VisualizerId;
