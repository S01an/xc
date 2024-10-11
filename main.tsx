import blog, { redirects } from "https://deno.land/x/blog/blog.tsx";
import { unocss_opts } from "./unocss.ts";

blog({
  author: "s01an",
  title: "s01an'Blog",
  description: "人望山 鱼窥荷",
  avatar: "https://smms.app/image/e6vT84nXPDmgkBL",
  avatarClass: "rounded-full",
  links: [
    { title: "Email", url: "mailto:s01an.xc@gmail.com" },
    { title: "GitHub", url: "https://github.com/S01an" },
    { title: "X", url: "https://x.com/Solan_xc" },
  ],
  lang: "zh",
  dateFormat: (date) =>
    date.toISOString().split("T")[0], // 改为 ISO 8601 格式
  middlewares: [
    redirects({
      "/foo": "/my_post",
      "bar": "my_post2",
    }),
  ],
  unocss: unocss_opts, // check https://github.com/unocss/unocss
  favicon: "favicon.ico",
});
