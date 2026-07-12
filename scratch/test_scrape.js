async function testFacebookScrape() {
    try {
        const url = 'https://mbasic.facebook.com/Nandailykc';
        console.log(`Fetching ${url}...`);
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await res.text();
        console.log(`Status code: ${res.status}`);
        console.log(`HTML Length: ${html.length}`);
        
        if (html.includes('login_form') || html.includes('login') || html.includes('captcha')) {
            console.log("Facebook requested login/captcha.");
        } else {
            console.log("Success! No login required. Preview of HTML:");
            console.log(html.substring(0, 1000));
        }
    } catch (e) {
        console.error("Error fetching:", e);
    }
}

testFacebookScrape();
