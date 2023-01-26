const extensions: [
  string,
  { mimetype: string; viewer: "audio" | "iframe" | "image" | "video" },
][] = [
  [".png", { mimetype: "image/png", viewer: "image" }],
  [".svg", { mimetype: "image/svg", viewer: "image" }],
  [".jpg", { mimetype: "image/jpg", viewer: "image" }],
  [".jpeg", { mimetype: "image/jpg", viewer: "image" }],
  [".webp", { mimetype: "image/webp", viewer: "image" }],
  [".pdf", { mimetype: "application/pdf", viewer: "iframe" }],
  [".mp4", { mimetype: "video/mp4", viewer: "video" }],
  [".mp3", { mimetype: "audio/mp3", viewer: "audio" }],
];
export function getViewerExtensionInfo(filename: string) {
  const info = extensions.find(([ending]) => filename.endsWith(ending));
  return info?.[1];
}
