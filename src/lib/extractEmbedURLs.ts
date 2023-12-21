export default function extractEmbedURLs(properties: any) {
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

  const embedURLs = embedKeys.map(({ key, name }) => ({
    name,
    url: properties[key].url as string,
  }));

  return embedURLs;
}
