export default {
    uniqueRandomNumbers(l,u,n) {
        //Example, uniqueRandomNumbers([lower_bound], [upper_bound], [quantity])
        var amount = n,
        lower_bound = l,
        upper_bound = u,
        unique_random_numbers = [];

        while (unique_random_numbers.length < amount) {
            var random_number = Math.floor(Math.random()*(upper_bound - lower_bound) + lower_bound);

            if (unique_random_numbers.indexOf(random_number) == -1) {
                // Yay! new random number
                unique_random_numbers.push( random_number );
            }
        }
        // unique_random_numbers is an array containing n unique numbers in the given range
        return unique_random_numbers;
    }

}