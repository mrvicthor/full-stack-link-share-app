const platformColors: Record<string, string> = {
  GitHub: "#040404",
  "Frontend Mentor": "#ffffff",
  Twitter: "#8CDCFC",
  LinkedIn: "#0680FA",
  Youtube: "#FF3939",
  Facebook: "#143C9C",
  Twitch: "#FB04FB",
  "Dev.to": "#333333",
  Codewars: "#C0449D",
  freeCodeCamp: "#442464",
  GitLab: "#FC5C04",
  Hashnode: "#0437DC",
  "Stack Overflow": "#F78B12",
};

export const getMatchingColor = (title: string) => platformColors[title];
