var sum_to_n_a = function (n) {
    return n * (n + 1) / 2;
};

var sum_to_n_b = function (n) {
    var sum = 0;
    for (var i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_c = function (n) {
    return Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0);
};