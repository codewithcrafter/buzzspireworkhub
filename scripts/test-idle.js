const fetch = require('node/fetch'); // not real, I'll use native fetch in node 18

async function test() {
  // We can just call the endpoints internally or via localhost:3000
  const res = await fetch("http://localhost:3000/api/health");
  console.log(await res.text());
}
test();
