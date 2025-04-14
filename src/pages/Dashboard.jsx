import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects"); // مسار API ديال المشاريع
        setProjects(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des projets", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Projets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p>Aucun projet trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
