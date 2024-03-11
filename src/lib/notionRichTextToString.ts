import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export default function notionRichTextToString(richText: RichTextItemResponse[]): string {
  return richText.reduce(
    (txt: string, { plain_text }: { plain_text: string }) => txt + plain_text,
    ""
  );
}
