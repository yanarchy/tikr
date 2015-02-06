exports.facets = function(req, res) {
  res.json({
    "facets": [
      {
        "field": "languages",
        "display": "Languages",
        "size": "10"
      },
      {
        "field": "location",
        "display": "Location",
        "size": "10"
      }
    ],
    "sortDir": "desc"
  });
};
