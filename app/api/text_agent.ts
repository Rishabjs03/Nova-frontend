"use server";
export async function text_agent(prompt: string) {
    const res = await fetch("https://nova-backend-production-de0d.up.railway.app/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ "input": prompt })
    })

    const data = await res.json()
    return data
}