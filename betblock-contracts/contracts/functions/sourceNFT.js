const words = args[0];
const tokenId = args[1];
if (!secrets.apiKey) {
  throw Error('Need betblock key!');
}
const apiRequest = Functions.makeHttpRequest({
  url: "https://api.betblock.fi/generateImage",
  headers: {
    "x-api-key": secrets.apiKey,
    'Content-Type': 'application/json'
  },
  params: {
    words: words,
    tokenId: tokenId
  },
  timeout: 10000
});
const apiResponse = await apiRequest;
if (apiResponse.error) {
  throw new Error("Response Error");
}
const val = apiResponse
console.log(val)
return Functions.encodeString(apiResponse)