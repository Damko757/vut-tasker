import { serve } from "bun";
import { ENV } from "./const.ts";

serve({
    fetch(request) {
        const res = new Response(ENV.port.toString());
        res.headers.set("Access-Control-Allow-Origin", "*");
        res.headers.set(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        );

        return res;
    },
    port: ENV.port,
});
