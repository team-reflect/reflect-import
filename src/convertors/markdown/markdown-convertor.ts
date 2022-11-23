import { domArrayToHtml } from "../../helpers/dom";
import { header1 } from "../../helpers/generators";
import { markdownToHtml } from "../../helpers/markdown";
import { Convertor, REFLECT_HOSTNAME } from "../../types";

export class MarkdownConvertor implements Convertor {
  graphId: string;
  linkHost: string;

  constructor({
    graphId,
    linkHost = REFLECT_HOSTNAME,
  }: {
    graphId: string;
    linkHost?: string;
  }) {
    this.graphId = graphId;
    this.linkHost = linkHost;
  }

  toHtml(markdown: string): string {
    const { html, data } = markdownToHtml(markdown, {
      graphId: this.graphId,
      linkHost: this.linkHost,
    });

    const subject = (data?.subject || data?.title) as string | undefined;

    return subject ? domArrayToHtml([header1(subject), html]) : html;
  }
}
