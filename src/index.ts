import * as core from "@actions/core";
import axios from "axios";

export async function run() {
  try {
    const token: string = core.getInput("auth-token");
    const projectId: string = core.getInput("project-id");
    const environmentId: string = core.getInput("environment-id");

    const url = `https://api.example.com`;

    const response = await axios.post(
      url,
      {
        project_id: projectId,
        environment_id: environmentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    core.setOutput("response", JSON.stringify(response.data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      core.setFailed(
        `Request failed: ${error.response?.data || error.message}`
      );
    } else {
      core.setFailed(`Request failed: ${(error as Error).message}`);
    }
  }
}

if (!process.env.JEST_WORKER_ID) {
  run();
}
