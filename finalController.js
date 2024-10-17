angular.module('myApp', [])
.controller('FinalController', function ($scope) {

    const exampleWords = [
        {lemma: 'apfel', definition: 'apple', category: 'food'},
        {lemma: 'banane', definition: 'banana', category: 'food'},
        {lemma: 'gato', definition: 'cat', category: 'animal'},
        {lemma: 'pes', definition: 'dog', category: 'animal'}
    ];
    const apiUrl = "https://en.wiktionary.org/w/api.php";
    let results = [];
    let newWord;

    if (window.localStorage.getItem("conlang_wordlist")) {
        $scope.words = JSON.parse(window.localStorage.getItem("conlang_wordlist"));
    }
    else {
        $scope.words = exampleWords;
    }
    
    $scope.checkWord = function(index) {
        let sendWord = $scope.words[index].lemma;
        console.log(sendWord);
        let fullUrl = apiUrl + "?origin=*&action=opensearch&search=" + sendWord + "&namespace=*";
        fetch(fullUrl).
            then(function(response) {return response.json();}).
            then(function(response) {
                console.log("Response:");
                console.log(response);
                let responseArray = response;
                console.log(responseArray);
                for (let i = 0; i < responseArray.length; i++) {
                    console.log("Entered for loop");
                    console.log(responseArray[1]);
                    console.log(responseArray[3]);
                    $scope.results.push([responseArray[1][i], responseArray[3][i]]);
                }
                console.log("Results " + $scope.results);
                }).catch(function(error) {console.log(error);});
    }

    $scope.addWord = function() {
        console.log("Adding a word");
        // This doesn't seem to work yet. Need to do more bug testing.
        $scope.words.push(newWord);
    }

    $scope.saveList = function() {
        window.localStorage.setItem("conlang_wordlist", JSON.stringify($scope.words));
    }

    $scope.$watch('results', function() {
        console.log("Results changed");
    })

    }
);