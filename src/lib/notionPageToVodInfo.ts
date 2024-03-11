import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type VodInfo = {
  id: string;
  embedURLs: {
    name: string;
    url: string;
  }[];
  passwordProtected: boolean;
  index: number | null;
  title: string;
  thubnailURL: string;
};

export default function notionPageToVodInfo(page: PageObjectResponse): VodInfo {
  const properties = page.properties;

  const embedURLs = extractEmbedURLs(properties);

  if (
    !(
      "rich_text" in properties.password &&
      "number" in properties.index &&
      "title" in properties.name &&
      "url" in properties.thumbnail_url
    )
  ) {
    throw "Invalid page object response from Notion API";
  }

  return {
    id: page.id,
    embedURLs,
    passwordProtected: properties.password.rich_text.length > 0,
    index: properties.index.number,
    title: properties.name.title.reduce(
      (txt: string, { plain_text }: { plain_text: string }) => txt + plain_text,
      ""
    ),
    thubnailURL:
      properties.thumbnail_url.url ??
      "https://placehold.co/320x180/222/FDFDFD?font=montserrat&text=No+Preview",
  };
}

function extractEmbedURLs(properties: any) {
  const keys = Object.keys(properties);
  const embedKeys = keys
    .map(key => {
      const result = key.match(/^embed_(\d+)_(.*)/);
      if (!result) return null;
      const [, index, name] = result;

      return { index: parseInt(index), name, key };
    })
    .filter(Boolean) as {
    index: number;
    key: string;
    name: string;
  }[];

  embedKeys.sort((a, b) => a.index - b.index);

  const embedURLs = embedKeys
    .map(({ key, name }) => ({
      name,
      url: properties[key].url as string,
    }))
    .filter(v => v.url);

  return embedURLs;
}
