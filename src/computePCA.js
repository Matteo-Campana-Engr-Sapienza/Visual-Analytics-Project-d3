function computePCA(data) {
  //['budget', 'gross', 'runtime', 'score', 'votes', 'year']

  var budget = data.map((d) => { return +d.budget || 0 })
  var gross = data.map((d) => { return +d.gross || 0 })
  var runtime = data.map((d) => { return +d.runtime || 0 })
  var score = data.map((d) => { return +d.score || 0 })
  var votes = data.map((d) => { return +d.votes || 0 })

  var budget_normalized = normalize(budget)
  var gross_normalized = normalize(gross)
  var runtime_normalized = normalize(runtime)
  var score_normalized = normalize(score)
  var votes_normalized = normalize(votes)

  var normalized_matrix = math.matrix(
    [
      budget_normalized,
      gross_normalized,
      runtime_normalized,
      score_normalized,
      votes_normalized
    ]
  )

  normalized_matrix = math.transpose(normalized_matrix)

  //console.log(normalized_matrix)
  var cov_matrix = [
    budget_normalized,
    gross_normalized,
    runtime_normalized,
    score_normalized,
    votes_normalized
  ]

  cov_matrix = covariance_matrix(cov_matrix)
  cov_matrix = math.matrix(cov_matrix)
  cov_matrix = math.transpose(cov_matrix)


  const ans = math.eigs(cov_matrix) // returns {values: [E1,E2...sorted], vectors: [v1,v2.... corresponding vectors as columns]}
  const eign_val = ans.values
  const eign_vec = ans.vectors

  var pc = [eign_vec._data[eign_vec._data.length - 1], eign_vec._data[eign_vec._data.length - 2]]
  pc = math.transpose(pc)

  var result = math.multiply(normalized_matrix, pc)
  result = result._data.map((d, index) => { return { "pca_1": d[0], "pca_2": d[1], "label": data[index] } })
  return result;
}


function compute_covariance(x, y) {

  var x_mean = d3.mean(x)
  var y_mean = d3.mean(y)

  x = x.map((x) => x / x_mean)
  y = y.map((y) => y / y_mean)

  return math.dot(x, y) / x.length || 0;
}

function normalize(vector) {
  var max_val = d3.max(vector)
  var min_val = d3.min(vector)
  var tmp = max_val - min_val
  return vector.map((d) => { return (d - min_val) / tmp })
}

function covariance_matrix(matrix) {

  var cov_matrix = [];
  for (var i = 0; i < matrix.length; i++) {
    cov_matrix[i] = new Array(matrix.length);
  }

  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix.length; j++) {

      var cov = compute_covariance(matrix[i], matrix[j])
      cov_matrix[i][j] = cov
      cov_matrix[j][i] = cov
    }
  }
  return cov_matrix;
}
