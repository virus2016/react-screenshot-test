import React from "react";
import { partialMock } from "../testing/partial-mock";
import { ReactComponentServer } from "./component-server";
import { ReactScreenshotRenderer } from "./renderer";
import { ScreenshotRenderer } from "./screenshot-renderer/api";

describe("ReactScreenshotRenderer", () => {
  let mockComponentServer: jest.Mocked<ReactComponentServer>;
  let mockScreenshotRenderer: jest.Mocked<ScreenshotRenderer>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockComponentServer = partialMock<ReactComponentServer>({
      start: jest.fn(),
      stop: jest.fn(),
      serve: jest.fn()
    });
    mockComponentServer.serve.mockImplementation((_node, callback) => {
      return callback(1234, "/rendered");
    });
    mockScreenshotRenderer = partialMock<ScreenshotRenderer>({
      start: jest.fn(),
      stop: jest.fn(),
      render: jest.fn()
    });
  });

  describe("start", () => {
    it("starts both", async () => {
      const renderer = new ReactScreenshotRenderer(
        mockComponentServer,
        mockScreenshotRenderer
      );
      await renderer.start();
      expect(mockComponentServer.start).toHaveBeenCalled();
      expect(mockScreenshotRenderer.start).toHaveBeenCalled();
    });
  });

  describe("start", () => {
    it("stops both", async () => {
      const renderer = new ReactScreenshotRenderer(
        mockComponentServer,
        mockScreenshotRenderer
      );
      await renderer.stop();
      expect(mockComponentServer.stop).toHaveBeenCalled();
      expect(mockScreenshotRenderer.stop).toHaveBeenCalled();
    });
  });

  describe("render", () => {
    it("delegates without viewport", async () => {
      const renderer = new ReactScreenshotRenderer(
        mockComponentServer,
        mockScreenshotRenderer
      );
      const node = <div>Hello, World!</div>;
      await renderer.render(node);
      expect(mockComponentServer.serve).toHaveBeenCalledWith(
        node,
        expect.anything()
      );
      expect(mockScreenshotRenderer.render).toHaveBeenCalledWith(
        expect.stringMatching(":1234/rendered")
      );
    });

    it("delegates with viewport", async () => {
      const renderer = new ReactScreenshotRenderer(
        mockComponentServer,
        mockScreenshotRenderer
      );
      const node = <div>Hello, World!</div>;
      await renderer.render(node, {
        width: 1024,
        height: 768
      });
      expect(mockComponentServer.serve).toHaveBeenCalledWith(
        node,
        expect.anything()
      );
      expect(mockScreenshotRenderer.render).toHaveBeenCalledWith(
        expect.stringMatching(":1234/rendered"),
        {
          width: 1024,
          height: 768
        }
      );
    });
  });
});