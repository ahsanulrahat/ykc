async function checkVercelResponse() {
    try {
        const url = 'https://ykc-ftyd-2bd82oyve-ahsanulrahats-projects.vercel.app/api/sync-facebook';
        console.log(`Fetching Vercel URL ${url}...`);
        const res = await fetch(url);
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Response text:`, text);
    } catch (e) {
        console.error("Error:", e);
    }
}
checkVercelResponse();
