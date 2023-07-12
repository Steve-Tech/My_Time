// My_Time - A simple time synchronisation web app
// Author: Steve-Tech
// This file is a Cloudflare Functions script that is used with a Cloudflare Pages deployment.

// Source: https://developers.cloudflare.com/workers/learning/using-websockets/

export async function onRequest({ request }) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
        return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();
    server.addEventListener('message', event => {
        let t2 = new Date().getTime();
        server.send(JSON.stringify({ "t1": event.data, "t2": t2 / 1000, "t3": new Date().getTime() / 1000 }));
    });

    return new Response(null, {
        status: 101,
        webSocket: client,
    });
}
