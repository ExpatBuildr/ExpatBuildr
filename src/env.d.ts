/// <reference path="../.astro/types.d.ts" />
import type { Runtime } from '@astrojs/cloudflare';

type Env = {
  BEEHIIV_API_KEY?: string;
  BEEHIIV_PUB_ID?: string;
  NOTION_API_KEY?: string;
};

declare namespace App {
  interface Locals extends Runtime<Env> {}
}
