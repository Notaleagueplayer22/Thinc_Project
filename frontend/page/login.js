document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".signin-form");
    
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailOrStudentId = document.querySelector(".email-input").value;
        const password = document.querySelector(".password-input").value;

        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailOrStudentId, studentId: emailOrStudentId, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token); // เก็บ Token
            alert("Login successful!");
            window.location.href = "dashboard.html"; // ไปหน้าหลักหลังล็อกอิน
        } else {
            alert(data.message);
        }
    });
});
