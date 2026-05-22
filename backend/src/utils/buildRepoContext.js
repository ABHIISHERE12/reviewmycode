function buildRepoContext(repositoryData = {}) {

    const {
        frontend = "Unknown",
        backend = "Unknown",
        database = "Unknown",
        framework = "Unknown",
        changedFiles = [],
        dependencies = [],
    } = repositoryData;

    return `
Repository Overview

Frontend: ${frontend}
Backend: ${backend}
Database: ${database}
Framework: ${framework}

Dependencies:
${dependencies.map(dep => `- ${dep}`).join("\n")}

Changed Files:
${changedFiles.map(file => `- ${file}`).join("\n")}
`;
}

module.exports = buildRepoContext;
