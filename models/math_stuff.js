var lower_profile = new Array();
var upper_profile = new Array();
var tolerance = double;

public double score(lower_profile, upper_profile, tolerance){
	if (array_sum(upper_profile)=0) {
		return score = 0;
	};
	var min_score = math.min(rank(upper_profile), (1 - rank(lower_profile)));
	var max_score = math.max(rank(upper_profile), (1 - rank(lower_profile)));

	score = ((1 - tolerance) * min_score + tolerance * max_score);
	return score;
}

public double array_sum(myArray()){
	var sum = 0;
	for (var i = 0; i < myArray.length; i++) {
		sum = sum + myArray[i];
	}
};

public double rank(myArray()){
	myRank = 0;
	for (var i = 0; myArray.length(); i++) {
		if (myArray[i] > 0) {
			myRank = myRank + math.exp(math.log(factorial(myArray[i] + i)) - math.log(factorial(i+1)) math.log(factorial(myArray[i]))); 
		};
		rank = (rank / (myArray.length)) 
	};
	return rank;
}

function factorial(op) {
 // Lanczos Approximation of the Gamma Function
 // As described in Numerical Recipes in C (2nd ed. Cambridge University Press, 1992)
 var z = op + 1;
 var p = [1.000000000190015, 76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 1.208650973866179E-3, -5.395239384953E-6];

 var d1 = Math.sqrt(2 * Math.PI) / z;
 var d2 = p[0];

 for (var i = 1; i <= 6; ++i)
  d2 += p[i] / (z + i);

 var d3 = Math.pow((z + 5.5), (z + 0.5));
 var d4 = Math.exp(-(z + 5.5));

 d = d1 * d2 * d3 * d4;

 return d;
}