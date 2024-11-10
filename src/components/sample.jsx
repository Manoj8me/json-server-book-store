import React from 'react';
import "../styles/Projects.css";

function Projects() {
  const projects = [
    {
      name: "Project One",
      description: "A brief description of the project.",
      technologies: "React, JavaScript, CSS",
      link: "https://github.com/yourusername/project1",
    },
    {
      name: "Project Two",
      description: "A brief description of another project.",
      technologies: "Node.js, Express, MongoDB",
      link: "https://github.com/yourusername/project2",
    },
  ];

  return (
    <div className="projects">
      <h1>Projects</h1>
      {projects.map((project, index) => (
        <div key={index} className="project-card">
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <p><strong>Technologies Used:</strong> {project.technologies}</p>
          <a href={project.link} target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </div>
      ))}
    </div>
  );
}

export default Projects;
