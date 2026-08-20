

async function submitTestLead() {
  const payload = {
    name: "John Doe TestBot",
    email: "john.bot@example.com",
    company: "TestBot Inc",
    phone: "9876543210",
    service: "Web Development",
    message: "Owner: Yes",
    source: "Website Chatbot",
    pageUrl: "http://localhost:3000/"
  };

  try {
    const res = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    console.log("Response:", data);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

submitTestLead();
