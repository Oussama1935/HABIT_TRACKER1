import { useEffect, useState } from "react";
import axios from "axios";

const ProjectCard = ({ project }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`/api/projects/${project.id}/progress`);
        setProgress(res.data.progress);
      } catch (err) {
        console.error("Erreur de récupération du progrès :", err);
      }
    };
    fetchProgress();
  }, [project.id]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold">{project.name}</h2>
      <p className="text-sm text-gray-500">{project.description}</p>

      {/* Progress bar */}
      <div className="mt-4">
        <p className="text-sm font-medium">Progression : {progress}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
