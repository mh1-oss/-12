
async function checkRole() {
    try {
        console.log("Logging in as john@mail.com...");
        const loginRes = await fetch('https://api.escuelajs.co/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'john@mail.com',
                password: 'changeme'
            })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
        const loginData = await loginRes.json();
        const token = loginData.access_token;
        console.log("Token obtained.");

        console.log("Fetching profile...");
        const profileRes = await fetch('https://api.escuelajs.co/api/v1/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!profileRes.ok) throw new Error(`Profile fetch failed: ${profileRes.status}`);
        const user = await profileRes.json();

        console.log("User Profile:", user);
        console.log("Role:", user.role);

        if (user.role === 'admin') {
            console.log("⚠️ WARNING: This user IS an admin!");
        } else {
            console.log("✅ This user is NOT an admin.");
        }

    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkRole();
