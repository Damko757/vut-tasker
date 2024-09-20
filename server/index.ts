import { serve } from "bun";
import { ENV } from "./const.ts";

serve({
    fetch(request) {
        return new Response(ENV.port);
    },
    port: ENV.port,
});
