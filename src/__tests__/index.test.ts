import * as core from "@actions/core";
import axios from "axios";
import { run } from "../index";

jest.mock("@actions/core", () => ({
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
}));

jest.mock("axios");

describe("run", () => {
  const mockGetInput = core.getInput as jest.Mock;
  const mockSetOutput = core.setOutput as jest.Mock;
  const mockSetFailed = core.setFailed as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set output when API request is successful", async () => {
    mockGetInput.mockReturnValueOnce("auth-token-value");
    mockGetInput.mockReturnValueOnce("project-id-value");
    mockGetInput.mockReturnValueOnce("environment-id-value");

    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { success: true },
    });

    await run();

    expect(mockGetInput).toHaveBeenCalledWith("auth-token");
    expect(mockGetInput).toHaveBeenCalledWith("project-id");
    expect(mockGetInput).toHaveBeenCalledWith("environment-id");
    expect(axios.post).toHaveBeenCalledWith(
      "https://api.example.com", 
      {
        project_id: "project-id-value",
        environment_id: "environment-id-value",
      },
      {
        headers: {
          Authorization: `Bearer auth-token-value`,
          "Content-Type": "application/json",
        },
      }
    );
    expect(mockSetOutput).toHaveBeenCalledWith("response", JSON.stringify({ success: true }));
    expect(mockSetFailed).not.toHaveBeenCalled();
  });

  it("should handle Axios error and set failed", async () => {
    mockGetInput.mockReturnValueOnce("auth-token-value");
    mockGetInput.mockReturnValueOnce("project-id-value");
    mockGetInput.mockReturnValueOnce("environment-id-value");

    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: { error: "undefined" },
      },
    });

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith("Request failed: undefined");
  });

  it("should handle unexpected error and set failed", async () => {
    mockGetInput.mockReturnValueOnce("auth-token-value");
    mockGetInput.mockReturnValueOnce("project-id-value");
    mockGetInput.mockReturnValueOnce("environment-id-value");

    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Unexpected error"));

    await run();
    expect(mockSetFailed).toHaveBeenCalledWith("Request failed: Unexpected error");
  });
});
