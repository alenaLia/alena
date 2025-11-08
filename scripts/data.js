fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRGZVKv3YR7KLpE069BBD4yhSqCQv0rqBSGP1UB_9AzHSk1LNbqn_dFbHygJGMKACa8Ae0QRPxuxuH6/pub?gid=930172912&single=true&output=csv")
  .then(res => res.text())
  .then(csv => {
    const rows = csv.split("\n").map(r => r.split(","));
    console.log(rows);
  });
