import blog from "https://deno.land/x/blog/blog.tsx";

blog({
  author: "s01an",
  title: "s01an'Blog",
  description: "人望山 鱼窥荷",
  avatar: "https://s2.loli.net/2024/10/11/pDxIYT59tCvWikg.jpg",
  avatarClass: "rounded-full",
  links: [
    { title: "Email", url: "mailto:s01an.xc@gmail.com" },
    { title: "GitHub", url: "https://github.com/S01an" },
    { title: "X", url: "https://x.com/Solan_xc" },
  ],
  lang: "zh",
  style: `
    body {
      background-color: white;
    }
  `,
});
