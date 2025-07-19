const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const linkURL = urlParams.get("url");
if (linkURL) {
  let a = document.getElementById("link");
  a.href = a.innerText = linkURL;
}
