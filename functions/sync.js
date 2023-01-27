// My_Time - A simple time synchronisation web app
// Author: Steve-Tech
// This file is a Cloudflare Functions script that is used with a Cloudflare Pages deployment. 

export function onRequest(context) {
    let t2 = new Date().getTime();
    return new Response(JSON.stringify({ "t2": t2 / 1000, "t3": new Date().getTime() / 1000 }))
}