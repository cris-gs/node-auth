import { envs } from "./config";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";



(() => {
    main();
})()

async function main () {
    // todo: await data base

    // todo: start our server
    new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    })
     .start()
}