// My_Time - A simple time synchronisation web app
// Author: Steve-Tech
// This file is a Cloudflare Functions script that is used with a Cloudflare Pages deployment.

export async function onRequestGet(context) {
    let t2 = new Date().getTime();
    return new Response(JSON.stringify({ "t2": t2 / 1000, "t3": new Date().getTime() / 1000 }))
}

export async function onRequestPost({ request }) {
    let t2 = new Date().getTime();
    let body = await request.text();
    return new Response(JSON.stringify({ "t1": body, "t2": t2 / 1000, "t3": new Date().getTime() / 1000 }))
}