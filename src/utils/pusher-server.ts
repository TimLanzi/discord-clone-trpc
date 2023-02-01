import Pusher from "pusher";
import { env as clientEnv } from "../env/client.mjs";
import { env as serverEnv } from "../env/server.mjs";

export const pusher = new Pusher({
  appId: serverEnv.PUSHER_APP_ID,
  key: clientEnv.NEXT_PUBLIC_PUSHER_KEY,
  secret: serverEnv.PUSHER_SECRET,
  cluster: clientEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
});