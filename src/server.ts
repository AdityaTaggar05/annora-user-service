import { createApp } from "./app";

export const startServer = ()=> {
    const app = createApp();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT,()=>{
        console.log(`User service running on http://localhost:${PORT}`)
    })
}