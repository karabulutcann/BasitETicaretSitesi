import { auth } from "@/auth";


export const POST = auth(async (req) => {
  const session = req.auth;
const apiKey = req.headers.get("x-api-key")
  // console.log(req.headers.get("x-api-key"), process.env.API_KEY, req.headers.get("x-api-key") === process.env.API_KEY)
  console.log(apiKey)

  if (apiKey === null || apiKey !== process.env.API_KEY) {
    return new Response(JSON.stringify({ err: "unauthorized" }), {
      status: 401,
    });
  }

  console.log("hello")


  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
  })
});
