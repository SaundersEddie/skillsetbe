import { ping } from "../services/pingService";

describe("pingService", () => {
  it("returns pong", () => {
    expect(ping()).toBe("pong");
  });
});
