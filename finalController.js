angular.module('myApp', [])
.controller('FinalController', function ($scope) {

    const exampleWords = [
        {lemma: 'apfel', definition: 'apple', category: 'food'},
        {lemma: 'banane', definition: 'banana', category: 'food'},
        {lemma: 'gato', definition: 'cat', category: 'animal'},
        {lemma: 'pes', definition: 'dog', category: 'animal'}
    ];
    const apiUrl = "https://en.wiktionary.org/w/api.php";
    const addDialog = document.getElementById("addDialog");
    let apiResponse = [];
    // let hasResults = false;

    $scope.newWord = {lemma: '', definition: '', category: ''};

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
                for (let i = 0; i < response[1].length; i++) {
                    apiResponse.push({'lemma': response[1][i], 'link': response[3][i]});
                }
                console.log("Results:");
                console.log(apiResponse);
                console.log(apiResponse[0]);
                $scope.updateResults(apiResponse);
                }).catch(function(error) {console.log(error);});
    }

    $scope.addWord = function() {
        console.log("Adding a word");
        // Create dialog box - have it update newWord - push newWord to words
        addDialog.showModal();
    }

    $scope.confirmAdd = function() {
        console.log($scope.newWord);
        $scope.words.push($scope.newWord);
        addDialog.close();
    }

    $scope.cancelAdd = function() {
        $scope.newWord = {lemma: '', definition: '', category: ''};
        addDialog.close();
    }

    $scope.saveList = function() {
        window.localStorage.setItem("conlang_wordlist", JSON.stringify($scope.words));
    }

    $scope.updateResults = function(newResults) {
        $scope.results = newResults;
        console.log("Display results: ");
        console.log($scope.results);
    }

    // $scope.showResults = function() {
    //     hasResults = true;
    // }

    $scope.$watch('results', function() {
        console.log("Results changed");
    }, true)

    }
);