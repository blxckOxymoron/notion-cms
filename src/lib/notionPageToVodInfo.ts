import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import notionRichTextToString from "./notionRichTextToString";
import { getSavedPassword } from "@/data/user";

export type VodInfo = {
  id: string;
  embedURLs: {
    name: string;
    url: string;
  }[];
  password: {
    protected: boolean;
    specified: boolean;
    correct: boolean;
  };
  index: number | null;
  title: string;
  thubnailURL: string;
};

export default async function notionPageToVodInfo(page: PageObjectResponse): Promise<VodInfo> {
  const password = await getSavedPassword(page.id);
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

  const passwordProtected = properties.password.rich_text.length > 0;
  const correctPassword = notionRichTextToString(properties.password.rich_text);
  const isCorrectPassword = !passwordProtected || password === correctPassword;

  return {
    id: page.id,
    embedURLs: isCorrectPassword ? embedURLs : [], // keep embedURLs empty if password is incorrect
    password: {
      protected: passwordProtected,
      specified: !!password,
      correct: isCorrectPassword,
    },
    index: properties.index.number,
    title: notionRichTextToString(properties.name.title),
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
