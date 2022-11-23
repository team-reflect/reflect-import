import { markdownToHtml } from "../../helpers/markdown";
import { describe, it, expect } from "vitest";

describe("nodesFromRoamMarkdown", () => {
  it("skips headings", () => {
    const { html } = markdownToHtml("# foo", {
      graphId: "123",
      linkHost: "http://example.com",
      constructsToDisable: ["thematicBreak", "list", "headingAtx"],
    });
    expect(html).toEqual("<p># foo</p>");
  });
});
