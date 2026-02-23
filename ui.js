document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const errorBox = document.getElementById("error-message");

  const BASE_URL = "https://portfolio-backend-api-h3tt.onrender.com/api";

  try {
    const [profileRes, skillRes, projectRes] = await Promise.all([
      fetch(`${BASE_URL}/profile`),
      fetch(`${BASE_URL}/skill`),
      fetch(`${BASE_URL}/project`),
    ]);

    if (!profileRes.ok || !skillRes.ok || !projectRes.ok) {
      throw new Error("One of the API calls failed");
    }

    const profileList = await profileRes.json();
    const skillList = await skillRes.json();
    const projectList = await projectRes.json();

    /* ================= PROFILE ================= */
    const profile = profileList[0];

    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-title").textContent = profile.title;
    document.getElementById("profile-bio").textContent = profile.bio;
    document.getElementById("profile-email").textContent = profile.email;

    document.getElementById("github-btn").href = profile.githubUrl;
    document.getElementById("linkedin-btn").href = profile.linkedInUrl;

    /* ================= SKILLS ================= */
    const skillsContainer = document.getElementById("skills-container");
    skillsContainer.innerHTML = "";

    skillList
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .forEach((skill) => {
        const card = document.createElement("div");
        card.classList.add("glass-card", "skill-card");
        card.innerHTML = `
          <h3 class="skill-name">${skill.name}</h3>
          <p class="skill-category">${skill.category}</p>
          <span class="skill-badge">${skill.proficiency}</span>
        `;
        skillsContainer.appendChild(card);
      });

    /* ================= PROJECTS ================= */
    const projectsContainer = document.getElementById("projects-container");
    projectsContainer.innerHTML = "";

    projectList.forEach((project) => {
      const card = document.createElement("div");
      card.classList.add("glass-card", "project-card");

      card.innerHTML = `
        <h3 class="project-title">${project.name}</h3>
        <p class="project-description">${project.description}</p>

        <div class="project-tech">
          ${project.technologies
            .split(",")
            .map((tech) => `<span class="tech-badge">${tech.trim()}</span>`)
            .join("")}
        </div>

        <div class="project-links">
          ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-btn">GitHub</a>` : ""}
          ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-btn secondary">Live</a>` : ""}
        </div>
      `;

      projectsContainer.appendChild(card);
    });

    /* ================= DONE ================= */
    loader.style.display = "none";
  } catch (error) {
    console.error(error);
    loader.style.display = "none";
    errorBox.classList.remove("hidden");
  }
});
